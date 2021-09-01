When you want to use or force index with Query Builder in Laravel, you can do it:

```php
$query = SomeModel::query()->getModel()
$query->setTable(DB::raw($query->getTable() . ' USE INDEX(index_name)'))
$results = $query->get();
```

In complex queries with `with()` previous solution doesn't work, you need to overwrite base query `from` value:

```php
$query = SomeModel::with('some_relations')...->orderBy();
$query->getQuery()->from(DB::raw($query->getQuery()->from . ' USE INDEX (index_name)'));
// or just
$query->getQuery()->from(DB::raw('`table` USE INDEX (index_name)'));
$results = $query->get();
```
