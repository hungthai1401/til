---
title: Nginx configuration for Next.js app
category: Web server
date: 2022-03-09
---

```
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;

upstream frontend {
    server 127.0.0.1:3000 max_fails=0;
    keepalive 64;
}

server {
    index index.html;
    server_name hyss.finance www.hyss.finance;
    client_max_body_size 100M;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_redirect off;
    proxy_read_timeout 240s;


    location /_next/static {
    	proxy_cache STATIC;
    	proxy_pass http://frontend;

    	# For testing cache - remove before deploying to production
    	add_header X-Cache-Status $upstream_cache_status;
    }

    location / {
        proxy_pass http://frontend/;
    }

    location ~ /.well-known {
        allow all;
    }
}

```
