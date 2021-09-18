---
title: Connect to MySQL server Docker container
category: Docker
date: 2021-09-18
---

Find out the IP address:

```bash
docker inspect <CONTAINER NAME> | grep IPAddress
```

Now you will connect to MySQL server with the above IP.
