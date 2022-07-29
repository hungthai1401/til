---
title: Solve PHPRedis with 'read error on connection' exception
category: PHP
date: 2022-07-29
---

When I use Supervisor to run a command to subscribe a Redis channel, I get the Redis exception with 'read error on connection' message.

To solve it, I have to set `default_socket_timeout` to `-1` before subscribing channel. PHPRedis uses the PHP sockets, which will timeout after a set amount of time.

Example:

```php
#[NoReturn]
private function subscribe()
{
    ini_set('default_socket_timeout ', -1);
    while (true) {
        try {
            Redis::connection('bc')->subscribe(['created-contract'], static function ($message) {
                logger()->debug("Created contract publish message: $message");
                dispatch(new SendNewContractNotification($message))->onQueue('notification');
            });
        } catch (Throwable $exception) {
            logger()->error($exception);
        }
    }
}
```

Refs:

- https://github.com/phpredis/phpredis/issues/492
- https://github.com/phpredis/phpredis/issues/70
- https://github.com/prwnr/laravel-streamer/issues/17
- https://www.php.net/manual/en/filesystem.configuration.php#ini.default-socket-timeout
