---
title: Multi SSH Keys settings for different github accounts
category: Git
date: 2021-09-04
---

## Create different public key

According the article [Mac Set-Up Git](http://help.github.com/mac-set-up-git/)

```sh
$ ssh-keygen -t rsa -C "your_email@youremail.com"
```

For example, 2 keys created at:

```sh
~/.ssh/id_rsa_hungthai1401
~/.ssh/id_rsa_thai.nguyenhung
```

Then, add these two keys as following

```sh
$ ssh-add ~/.ssh/id_rsa_hungthai1401
$ ssh-add ~/.ssh/id_rsa_thai.nguyenhung
```

You can delete all cached keys before

```sh
$ ssh-add -D
```

Finally, you can check your saved keys

```sh
$ ssh-add -l
```

## Modify the ssh config

```sh
$ cd ~/.ssh/
$ touch config
$ subl -a config
```

Then added

```sh
#hungthai1401 account
Host github.com-hungthai1401
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_hungthai1401

#thai.nguyenhung account
Host github.com-thai.nguyenhung
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_thai.nguyenhung
```

## Clone you repository and modify your Git config

```sh
git clone git@github.com-hungthai1401:hungthai1401/til.git til
```

cd til and modify git config

```sh
$ git config user.name "Thai Nguyen Hung"
$ git config user.email "hungthai1401.it@gmail.com"
```

Then use normal flow to push your code

```sh
$ git add .
$ git commit -m "your comments"
$ git push
```
