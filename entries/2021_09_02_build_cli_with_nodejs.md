---
title: Build CLI with NodeJs
date: 2021-09-02
---

- Add a `bin` property to our `package.json` file. This maps the command name to the name of the file to be executed (relative to package.json)

```json
{
  "bin": {
    "til": "./index.js"
  }
}
```

So, when you install app, it'll create a symlink from the index.js script to /usr/local/bin/til.

## Note:

Please make sure that your file(s) referenced in bin starts with #!/usr/bin/env node, otherwise the scripts are started without the node executable!

- Run `yarn link` or `npm link` to create a symlink to this package.

## Refs:

- https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin
- https://docs.npmjs.com/cli/v7/commands/npm-link
- https://classic.yarnpkg.com/en/docs/cli/link/
