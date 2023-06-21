---
title: Xdebug on macOS
category: PHP
date: 2023-06-21
---

1. Install PHP through Homebrew

```shell
brew install php
```

2. Install Xdebug

```shell
brew install shivammathur/extensions/xdebug
```

3. Verify the installation

```shell
php -v
```

4. Update Xdebug configuration

```shell
[xdebug]
...
xdebug.mode=debug
xdebug.start_with_request=trigger
xdebug.client_port=9003
```
