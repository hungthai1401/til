---
title: Chaining requests in Postman
category: Others
date: 2023-02-02
---

I have `TOKEN` that a collection environment in Postman. I use it to set Authentication for all requests in this collection.

The flow goes like this:

1. Send `login` request from Postman
2. Retrieve the response and copy `access_token` value from the response body
3. Go to the collection environment manager
4. Set `TOKEN` variable value
5. Submit the other requests

I can see that `Tests execute after the response is received. When you select Send, Postman runs your test script after the response data returns from the API` so I use it to set `TOKEN` variable automatically.

I write this script for login request:

```js
var jsonData = JSON.parse(responseBody);
pm.collectionVariables.set("TOKEN", `${jsonData.data.access_token}`);
```

After login success, I can see the `TOKEN` variable value has changed, so I can make the other requests.

## Refs

- https://learning.postman.com/docs/writing-scripts/test-scripts/#writing-test-scripts
