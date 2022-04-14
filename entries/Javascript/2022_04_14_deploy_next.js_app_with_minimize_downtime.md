---
title: Deploy Next.js app with minimize downtime
category: Javascript
date: 2022-04-14
---

Set `distDir` in `next.config.js`

```js
module.exports = {
  distDir: process.env.BUILD_DIR || '.next',
  ...
}
```

Deploy with this script:

```sh
echo "Deploy starting..."

git pull origin
yarn install || exit

BUILD_DIR=temp yarn build || exit

if [ ! -d "temp" ]; then
  echo '\033[31m temp Directory not exists!\033[0m'
  exit 1;
fi

rm -rf .next

mv temp .next

pm2 restart ecosystem.config.js
pm2 save

echo "Deploy done."
```

Refs:

- https://nextjs.org/docs/api-reference/next.config.js/setting-a-custom-build-directory
