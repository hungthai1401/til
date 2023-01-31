---
title: File permissions in Linux
category: Linux
date: 2023-01-31
---

## Linux File Ownership

3 types of owner:
- User
- Group
- Other

## Linux File Permissions

3 permissions for all the 3 owners:
- Read (r)
- Write (w)
- Execute (x)

Example:

![](https://www.guru99.com/images/Permis_system.png)

We have `-rw-rw-r–` permission
- The first `-` implies that we have selected a file. Else, if were a directory, `d` would have been shown
- The first part is `rw-`, this suggests that the owner `home` can:
    - Read the file
    - Write or edit the file
    - He cannot execute the file since the execute bit is set to `-`
- The second part is `rw-`, it for the user group `home` and group members can:
    - Read the file
    - Write or edit the file
- The third part for the world which mean any user. It says `r--`. This means the user can only
    - Read the file

## Changing file/directory permissions

We can use `chmod` command to set permissions on a file/directory for the owner, group and the world.
There are 2 ways to use the command:
- Absolute mode

    In this mode, file permissions are not represented as characters but a three-digit octal number.

    | Number      | Permission Type        | Symbol |
    |-------------| -----------------------|--------|
    | 0           | No Permission          |   ---  |
    | 1           | Execute                |   --x  |
    | 2           | Write                  |   -w-  |
    | 3           | Execute + Write        |   -wx  |
    | 4           | Read                   |   r--  |
    | 5           | Read + Execute         |   r-x  |
    | 6           | Read + Write           |   rw-  |
    | 7           | Read + Write + Execute |   rwx  |


    ![](https://www.guru99.com/images/chmod_new(1).png)

    ![](https://www.guru99.com/images/FilePermissions(1).png)

- Symbolic mode

    We can modify permissions of a specific owner.

    | Operator | Description                                                   |
    |----------|---------------------------------------------------------------|
    |    +     | Adds a permission                                             |
    |    -     | Removes the permission                                        |
    |    =     | Sets the permission and overrides the permissions set earlier |

    | User Denotations | Description |
    |------------------|-------------|
    |         u        | user/owner  |
    |         g        | group       |
    |         o        | other       |
    |         a        | all         |

    ![](https://www.guru99.com/images/Symbolic_Mode(1).png)

## Changing Ownership and Group

For changing ownership, we use `chown user filename` command.
For change the user as well as group, we use `chown user:group filename` command.

![](https://www.guru99.com/images/chown_comm(1).png)

We use `chgrp group_name filename` command to change group-owner only

![](https://www.guru99.com/images/chgrp.png)

## Notes:
- The file `/etc/group` contains all the groups defined in the system
- You can use the command `groups` to find all the groups you are a member of

    ![](https://www.guru99.com/images/groups.png)
- You can use the command `newgrp` to work as a member a group other than your default group

    ![](https://www.guru99.com/images/newgrp.png)
- You cannot have 2 groups owning the same file
- You do not have nested groups in Linux. One group cannot be sub-group of other
- x - eXecuting a directory means Being allowed to “enter” a dir and gain possible access to sub-dirs
- There are other permissions that you can set on Files and Directories which will be covered in a later advanced tutorial

## Refs:
- https://www.guru99.com/file-permissions.html
