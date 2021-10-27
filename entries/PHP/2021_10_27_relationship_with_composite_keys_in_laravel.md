---
title: Relationship with composite keys in Laravel
category: PHP
date: 2021-10-27
---

Create abstract class contains common logic.

```php
namespace App\Models\Relations;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Collection as BaseCollection;

abstract class RelationWithCompositeKeys extends Relation
{
    /** @var Model|Builder */
    protected $query;

    /** @var Model */
    protected $parent;

    /** @var array */
    protected array $foreignKeys;

    /** @var array */
    protected array $localKeys;

    /**
     * Create a new has one or many relationship instance.
     *
     * @param Model $parent
     * @param Builder $query
     * @param array $foreignKeys
     * @param array $localKeys
     */
    public function __construct(Model $parent, Builder $query, array $foreignKeys, array $localKeys)
    {
        $this->localKeyss = $localKeys;
        $this->foreignKeys = $foreignKeys;

        parent::__construct($query, $parent);
    }

    /**
     * @return void
     */
    public function addConstraints(): void
    {
        if (static::$constraints) {
            $this
                ->query
                ->join($this->parent->getTable(), function (JoinClause $join): void {
                    foreach ($this->localKeys as $index => $key) {
                        if ($index === 0) {
                            $join->on(
                                $this->getQualifiedKeyName($key),
                                $this->getQualifiedForeignKeyName($this->foreignKeys[$index])
                            );
                            $join->where($this->getQualifiedKeyName($key), $this->parent->{$key});
                            continue;
                        }

                        $join->whereColumn(
                            $this->getQualifiedKeyName($key),
                            $this->getQualifiedForeignKeyName($this->foreignKeys[$index])
                        );
                    }
                })
                ->select($this->getQualifiedForeignKeyName('*'));
        }
    }

    /**
     * @param array $models
     */
    public function addEagerConstraints(array $models): void
    {
        foreach ($this->localKeys as $index => $key) {
            $this->query
                ->whereIn(
                    $this->getQualifiedForeignKeyName($this->foreignKeys[$index]),
                    collect($models)->pluck($key)
                );
        }
    }

    /**
     * @param array $models
     * @param string $relation
     * @return array<Model>
     */
    public function initRelation(array $models, $relation): array
    {
        foreach ($models as $model) {
            $model->setRelation(
                $relation,
                $this->related->newCollection()
            );
        }

        return $models;
    }

    /**
     * @param array $models
     * @param Collection $results
     * @param string $relation
     * @return array<Model>
     */
    public function match(array $models, Collection $results, $relation): array
    {
        if ($results->isEmpty()) {
            return $models;
        }

        foreach ($models as $model) {
            $model->setRelation(
                $relation,
                $this->getRelationValue($results, $model),
            );
        }

        return $models;
    }

    /**
     * @return Collection|array<Model>|Model
     */
    abstract public function getResults();

    /**
     * @param Collection|BaseCollection $results
     * @param Model $model
     * @return Collection|array<Model>|Model|null
     */
    protected function getRelationValue($results, Model $model)
    {
        foreach ($this->foreignKeys as $index => $key) {
            $results = $results->filter(function (Model $related) use ($model, $index, $key) {
                return $related->{$key} === $model->{$this->localKeys[$index]};
            });
        }

        return $results->values();
    }

    /**
     * @param string $key
     * @return string
     */
    protected function getQualifiedForeignKeyName(string $key): string
    {
        return "{$this->query->getModel()->getTable()}.$key";
    }

    /**
     * @param string $key
     * @return string
     */
    protected function getQualifiedKeyName(string $key): string
    {
        return "{$this->parent->getTable()}.$key";
    }
}
```

Create classes extends the above abstract class:

```php
namespace App\Models\Relations;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection as BaseCollection;

class HasOneWithCompositeKeys extends RelationWithCompositeKeys
{
    /**
     * @return ?Model
     */
    public function getResults(): ?Model
    {
        return $this->query->first();
    }

    /**
     * @param Collection|BaseCollection $results
     * @param Model $model
     * @return Model
     */
    protected function getRelationValue($results, Model $model): Model
    {
        $relations = parent::getRelationValue($results, $model);
        return $relations->first();
    }
}
```

```php
namespace App\Models\Relations;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class HasManyWithCompositeKeys extends RelationWithCompositeKeys
{
    /**
     * @return Collection|array<Model>
     */
    public function getResults(): Collection
    {
        return $this->query->get();
    }
}
```

```php
namespace App\Models\Relations;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class HasManyWithCompositeKeys extends RelationWithCompositeKeys
{
    /**
     * @return Collection|array<Model>
     */
    public function getResults(): Collection
    {
        return $this->query->get();
    }
}
```

Create traits to use in Models:

```php
namespace App\Models\Traits;

use App\Models\Relations\HasManyWithCompositeKeys;
use App\Models\Relations\HasOneWithCompositeKeys;

trait HasRelationshipWithCompositeKeys
{
    /**
     * @param $related
     * @param array $foreignKeys
     * @param array $localKeys
     * @return HasOneWithCompositeKeys
     */
    public function hasOneWithCompositeKeys($related, array $foreignKeys, array $localKeys): HasOneWithCompositeKeys
    {
        return new HasOneWithCompositeKeys(
            $this,
            $this->newRelatedInstance($related)->newQuery(),
            $foreignKeys,
            $localKeys
        );
    }

    /**
     * @param $related
     * @param array $foreignKeys
     * @param array $localKeys
     * @return HasManyWithCompositeKeys
     */
    public function hasManyWithCompositeKeys($related, array $foreignKeys, array $localKeys): HasManyWithCompositeKeys
    {
        return new HasManyWithCompositeKeys(
            $this,
            $this->newRelatedInstance($related)->newQuery(),
            $foreignKeys,
            $localKeys
        );
    }
}
```

Usage:

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class A extends Model
{
    use \App\Models\Traits\HasRelationshipWithCompositeKeys;

    public function b()
    {
        return $this->hasManyWithCompositeKeys('B', ['foreignKey1', 'foreignKey2'], ['localKey1', 'localKey2']);
    }

    public function c()
    {
        return $this->hasOneWithCompositeKeys('C', ['foreignKey1', 'foreignKey2'], ['localKey1', 'localKey2']);
    }
}
```

Refs:

- https://stitcher.io/blog/laravel-custom-relation-classes
