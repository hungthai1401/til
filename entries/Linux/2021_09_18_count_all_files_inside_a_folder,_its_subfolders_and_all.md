---
title: Count all files inside a folder, its subfolders and all
category: Bash
date: 2021-09-18
---

`find . -type f | wc -l` will recursively list all the files (`-type f` restricts to only files) in the current directory (replace `.` with your path). The output of this is piped into `wc -l` which will count the number of lines.

Refs:

- https://stackoverflow.com/questions/9769434/how-to-count-all-files-inside-a-folder-its-subfolder-and-all-the-count-should/9769492
