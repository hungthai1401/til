---
title: The attributes are not casted correctly when using SQL Server in Laravel
category: PHP
date: 2021-12-21
---

I found an issue that all the attributes are casted to string (or probably not casted correctly) when I use SQL Server. This problem occurs when I use eloquent to get data from a model.

The solution: In your `config/database.php` add the following options:

```php
'sqlsrv' => [
    'driver' => 'sqlsrv',
    'host' => env('DB_HOST', 'localhost'),
    'port' => env('DB_PORT', '1433'),
    'database' => env('DB_DATABASE', ''),
    'username' => env('DB_USERNAME', ''),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8',
    'prefix' => '',
    'options' => [
        PDO::ATTR_STRINGIFY_FETCHES => false,
        PDO::SQLSRV_ATTR_FETCHES_NUMERIC_TYPE => true,
    ],
],
```

Refs:

- https://github.com/laravel/framework/issues/11780#issuecomment-415694128
