---
title: Detect N+1 query in Laravel
date: 2020-06-03
---

To detect N + 1 query, override `getRelationshipFromMethod` method in Eloquent

```php
/**
 * Get a relationship value from a method.
 *
 * @param  string $method
 *
 * @return mixed
 *
 * @throws \LogicException
 * @throws \LazyLoadingException
 */
protected function getRelationshipFromMethod($method)
{
    $modelName = static::class;
    $exception = new LazyLoadingException("Attempting to lazy-load relation '$method' on model '$modelName'");
    if (! app()->isLocal()) {
        logger()->warning($exception->getTraceAsString());
        goto next;
    }

    report($exception);

    next:
    return parent::getRelationshipFromMethod($method);
}
```
