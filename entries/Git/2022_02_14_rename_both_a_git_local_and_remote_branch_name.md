---
title: Rename both a Git local and remote branch name
category: Git
date: 2022-02-14
---

1. Switch to the local branch you want to rename

```sh
git checkout <old_name>
```

2. Rename the local branch

```sh
git branch -m <new_name>
```

3. Push the `<new_name>` local branch and reset the upstream branch

```sh
git push origin -u <new_name>
```

4. Delete the `<old_name>` remote branch

```sh
git push origin --delete <old_name>
```
