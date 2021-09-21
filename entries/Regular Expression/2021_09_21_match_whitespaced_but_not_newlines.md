---
title: Match whitespaced but not newlines
category: Regular Expression
date: 2021-09-21
---

Use a double-negative:

```
/[^\S\r\n]/
```

or use negative lookbehind:

```
/\s(?<!\n)/
```
