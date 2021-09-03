---
title: Use Git commit-msg hook to validate commit message
category: Git
date: 2021-09-03
---

The `commit-msg` hook takes one parameter, which again is the path to a temporary file that contains the commit message written by the developer. If this script exits non-zero, Git aborts the commit process.

```bash
#!/bin/bash
################################################################################
# Store this file as .git/hooks/commit-msg in your repository in order to      #
# enforce checking for proper commit message format before actual commits. You #
# may need to make the script executable by 'chmod +x .git/hooks/commit-msg'.  #
################################################################################
path=$1
messageRegex="^(revert: )?(feat|fix|docs|dx|refactor|perf|test|workflow|build|ci|chore|types|wip|release|deps)(\(.+\))?: .{1,50}"
commitMsg=$(head -n1 $path)
if [[ $commitMsg =~ $messageRegex ]];then
  exit 0
else
  echo "\033[31m Invalid semantic commit message format."
  echo "\033[31m See https://gist.github.com/hungthai1401/eb8f7cc5317cb29b937c90f20098560d for more details"
  exit 1
fi
```

Refs:

- https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks
- https://github.com/vitejs/vite/blob/main/scripts/verifyCommit.js
