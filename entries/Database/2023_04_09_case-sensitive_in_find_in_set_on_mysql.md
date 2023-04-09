---
title: Case-sensitive in FIND_IN_SET on MySQL
category: Database
date: 2023-04-09
---

As you know that `FIND_IN_SET` is case-insensitive. That means if your list has `a,b` and you want to search `B`, it will return the position of `b`.

To be case sensitive, add `binary` modifier to the 1st argument:

`` FIND_IN_SET(binary 'value', `field`) ``

#### Refs:

- https://github.com/tpetry/laravel-query-expressions/pull/3
