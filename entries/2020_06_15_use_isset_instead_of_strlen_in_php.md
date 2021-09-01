`isset()` is faster than using `strlen()` because calling a function is more expensive than using a language construct.

Test to show the speed http://codepad.org/ztYF0bE3

```
strlen() over 1000000 iterations 7.5193998813629
isset() over 1000000 iterations 0.29940009117126
```

Refs:

- https://www.phpreferencebook.com/tips/use-isset-instead-of-strlen/
