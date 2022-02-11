---
title: Use form request manually in Laravel
category: PHP
date: 2022-02-11
---

```php
request()->merge([
    'for' => 'bar',
    ...
]);

// Resolve the form request through the IOC
app(\App\Http\Requests\ExampleRequest::class);
```
