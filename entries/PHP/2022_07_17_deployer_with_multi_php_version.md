---
title: Deployer with multi PHP version
category: PHP
date: 2022-07-17
---

If you want run multi repositories with difference PHP versions, you can set PHP path in Deployer for specific version:

```yaml
config:
  ...
  'bin/php': '/usr/bin/php7.4'
```

or

```php
set('bin/php', function () {
    return '/usr/bin/php7.4';
});
```

Refs:

- https://deployer.org/docs/7.x/recipe/common#binphp
