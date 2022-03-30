---
title: Change environment variables at runtime with VueCli
category: Javascript
date: 2022-03-30
---

In VueCli, The environment variables get referenced and baked into the built artifacts at build time (`npm build`), not run time.

I only use `.env` files during development, when deploying i use k8s ConfigMap to map these values directly to env vars, they can use only at run time so I need a custom entrypoint shell script in Dockerfile:

```bash
#!/bin/sh

# Replace env vars in JavaScript files
echo "Replacing env vars in JS"
for file in /usr/share/nginx/html/js/app.*.js;
do
  echo "Processing $file ...";

  # Use the existing JS file as template
  if [ ! -f $file.tmpl.js ]; then
    cp $file $file.tmpl.js
  fi

  envsubst '$APP_API_URL,$APP_PERSIST_NAME' < $file.tmpl.js > $file
done

echo "Starting Nginx"
nginx -g 'daemon off;'
```

This will change any instances of $APP_API_URL and $APP_PERSIST_NAME from the built code with the current environment variable passed to the kubernetes pod/docker run, this shell actually starts an nginx to serve the files, but I can change it to anything I want.

In my app, I also use a helper to reference all variables from one place.

```js
export default class Configuration {
  static get CONFIG() {
    return {
      APP_API_URL: "$APP_API_URL",
      APP_PERSIST_NAME: "$APP_PERSIST_NAME",
    };
  }

  static value(name) {
    if (!(name in this.CONFIG)) {
      console.log(`Configuration: There is no key named "${name}"`);
      return;
    }

    const value = this.CONFIG[name];

    if (!value) {
      console.log(`Configuration: Value for "${name}" is not defined`);
      return;
    }

    if (value.startsWith("$VUE_APP_")) {
      // value was not replaced, it seems we are in development.
      // Remove $ and get current value from process.env
      const envName = value.substr(1);
      const envValue = process.env[envName];
      if (envValue) {
        return envValue;
      } else {
        console.log(
          `Configuration: Environment variable "${envName}" is not defined`
        );
      }
    } else {
      // value was already replaced, it seems we are in production.
      return value;
    }
  }
}
```
