---
title: Batch processing of requests with Elasticsearch PHP client
category: PHP
date: 2021-09-04
---

The Elasticsearch PHP client offers a mode called `"future"` or `"async"` mode allows batch processing of requests (sent in parallel to the cluster).

```php
$client = ClientBuilder::create()->build();
$futures = [];

for ($i = 0; $i < 1000; $i++) {
    $params = [
        'index'  => 'test',
        'id'     => $i,
        'client' => [
            'future' => 'lazy',
        ],
    ];

    $futures[] = $client->get($params);     //queue up the request
}

foreach ($futures as $future) {
    // access future's values, causing resolution if necessary
    echo $future['_source'];
}
```

Batch size defaults to `100` requests/batch. The batch size can be set via the `max_handles` setting when configuring the handler:

```php
$handlerParams = [
    'max_handles' => 500,
];

$defaultHandler = ClientBuilder::defaultHandler($handlerParams);

$client = ClientBuilder::create()
            ->setHandler($defaultHandler)
            ->build();
```

Refs:

- https://www.elastic.co/guide/en/elasticsearch/client/php-api/current/future_mode.html
