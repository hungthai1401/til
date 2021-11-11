---
title: Enable the logger with Elasticsearch PHP Client
category: PHP
date: 2021-11-11
---

Install [Monolog](https://github.com/Seldaek/monolog) (any logger that implements the `PSR/Log` interface works)

```js
{
    "require": {
        ...
        "elasticsearch/elasticsearch" : "~5.0",
        "monolog/monolog": "~1.0"
    }
}
```

Create a log object and inject it into the client

```php
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

$logger = new Logger('name');
$logger->pushHandler(new StreamHandler('path/to/your.log', Logger::WARNING));

$client = ClientBuilder::create()       // Instantiate a new ClientBuilder
    ->setLogger($logger)                // Set your custom logger
    ->build();                          // Build the client object
```

Refs:

- https://www.elastic.co/guide/en/elasticsearch/client/php-api/master/enabling_logger.html
