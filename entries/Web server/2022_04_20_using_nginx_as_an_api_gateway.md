---
title: Using nginx as an API gateway
category: Web server
date: 2022-04-20
---

I have the list of services:

- Authentication: `10.0.0.1:8080`
- Product: `10.0.0.1:8081`
- Order: `10.0.0.1:8082`

I have configured nginx to proxy forward to each service. I have to protect some services by using authentication service via a subrequest. When user requests protected area, nginx makes an internal POST request to `/auth`. If 2xx is returned, protected contents are served. Anything else, nginx responds with 401.

```conf
upstream authentication {
  server 10.0.0.1:8080;
}

upstream product {
  server 10.0.0.1:8081;
}

upstream order {
  server 10.0.0.1:8082;
}

server {
  listen 80;

  location /auth {
    proxy_pass https://authentication/;
    proxy_method POST;
    proxy_set_header Content-Length "";
    # let proxy server know more details of request
    proxy_set_header X-Original-URI $request_uri;
    proxy_set_header X-Original-Remote-Addr $remote_addr;
    proxy_set_header X-Original-Host $host;
  }

  location /product {
    auth_request /auth;
    auth_request_set $auth_status $upstream_status;
    proxy_pass https://product/;
  }

  location /order {
    auth_request /auth;
    auth_request_set $auth_status $upstream_status;
    proxy_pass https://order/;
  }
}
```

Refs:

- https://www.nginx.com/c/deploy-nginx-as-an-api-gateway/
- https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-subrequest-authentication/
