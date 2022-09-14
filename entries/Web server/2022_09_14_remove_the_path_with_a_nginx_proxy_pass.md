---
title: Remove the path with a nginx proxy_pass
category: Web server
date: 2022-09-14
---

```conf
location /en/ {
    proxy_pass http://example.com/;  # note the trailing slash here, it matters!
}
```
