---
title: Find and kill process locking port
category: Linux
date: 2021-09-04
---

### Find PID of process locking port:

```sh
sudo lsof -t -i :<PORT>
```

### Kill process:

```sh
kill -9 <PID>
```
