---
title: Solve Content Too Large when using Laravel Octane with OpenSwoole
category: PHP
date: 2023-02-27
---

I have the problem that I can't upload a maximum of 2 Mb files in my application. I received the HTTP `413 Content Too Large` response status code, which indicates that the request entity is larger than limits defined by server. I use Nginx as Web Server. The first thing I tried was to adjust `client_max_body_size` of Nginx config and `upload_max_filesize`, `post_max_size` of PHP config. But without success.

### Solution

After some searching I found that in OpenSwoole, the maximum size is limited by the `package_max_length`, the default is 2M. So I have to read source code of Laravel Octane to override this option.

In `createSwooleServer.php`, I can see:

```php
<?php

$config = $serverState['octaneConfig'];

try {
    $server = new Swoole\Http\Server(
        $serverState['host'] ?? '127.0.0.1',
        $serverState['port'] ?? '8080',
        SWOOLE_PROCESS,
        ($config['swoole']['ssl'] ?? false)
            ? SWOOLE_SOCK_TCP | SWOOLE_SSL
            : SWOOLE_SOCK_TCP,
    );
} catch (Throwable $e) {
    Laravel\Octane\Stream::shutdown($e);

    exit(1);
}

$server->set(array_merge(
    $serverState['defaultServerOptions'],
    $config['swoole']['options'] ?? []
));

return $server;
```

So I can add some options config at `config/octane.php` for override default options.

```php
...
'swoole' => [
    'options' => [
        'package_max_length' => 1024 * 1024 * 100, // 100MB
    ],
],
```

### Refs

- https://openswoole.com/docs/common-questions-index#post-file-upload-size
- https://laravel.com/docs/10.x/octane#swoole-configuration
