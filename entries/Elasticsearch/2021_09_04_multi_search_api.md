---
title: Multi search API
category: Elasticsearch
date: 2021-09-04
---

The `msearch` API executes several searches with a single API request.

### Format:

```js
GET /<target>/_msearch
header\n
body\n
header\n
body\n
```

### Example:

```js
GET _msearch
{ "index": "index-1" }
{ "query": { "match_all": {} }, "from" : 0, "size" : 2 }
{ "index": "index-2" }
{ "query": { "match_all": {} }, "from" : 0, "size" : 2 }
```

```json
{
  "responses": [
    {
      ...,
      hits: {
        "total": 2,
        ...,
        "hits": [
          {
            "_index" : "index-1",
            ...,
            "_source": {
                ...
            }
          },
          {
            "_index" : "index-1",
            ...,
            "_source": {
                ...
            }
          }
        ]
      }
    },
    {
      ...,
      hits: {
        "total": 2,
        ...,
        "hits": [
          {
            "_index" : "index-2",
            ...,
            "_source": {
              ...
            }
          },
          {
            "_index" : "index-2",
            ...,
            "_source": {
              ...
            }
          }
        ]
      }
    }
  ]
}
```

The response returns a `responses` array, which includes the search response and status code for each search request matching its order in the original multi search request. If there was a complete failure for that specific search request, an object with `error` message and corresponding status code will be returned in place of the actual search response.

### Refs:

- https://www.elastic.co/guide/en/elasticsearch/reference/6.8/search-multi-search.html
