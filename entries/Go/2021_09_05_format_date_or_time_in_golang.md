---
title: Format a date or time in Golang
category: Go
date: 2021-09-05
---

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    currentTime := time.Now()

    fmt.Println("Current Time in String: ", currentTime.String())

    fmt.Println("MM-DD-YYYY : ", currentTime.Format("01-02-2006"))

    fmt.Println("YYYY-MM-DD : ", currentTime.Format("2006-01-02"))

    fmt.Println("YYYY.MM.DD : ", currentTime.Format("2006.01.02 15:04:05"))

    fmt.Println("YYYY#MM#DD {Special Character} : ", currentTime.Format("2006#01#02"))

    fmt.Println("YYYY-MM-DD hh:mm:ss : ", currentTime.Format("2006-01-02 15:04:05"))

    fmt.Println("Time with MicroSeconds: ", currentTime.Format("2006-01-02 15:04:05.000000"))

    fmt.Println("Time with NanoSeconds: ", currentTime.Format("2006-01-02 15:04:05.000000000"))

    fmt.Println("ShortNum Month : ", currentTime.Format("2006-1-02"))

    fmt.Println("LongMonth : ", currentTime.Format("2006-January-02"))

    fmt.Println("ShortMonth : ", currentTime.Format("2006-Jan-02"))

    fmt.Println("ShortYear : ", currentTime.Format("06-Jan-02"))

    fmt.Println("LongWeekDay : ", currentTime.Format("2006-01-02 15:04:05 Monday"))

    fmt.Println("ShortWeek Day : ", currentTime.Format("2006-01-02 Mon"))

    fmt.Println("ShortDay : ", currentTime.Format("Mon 2006-01-2"))

    fmt.Println("Short Hour Minute Second: ", currentTime.Format("2006-01-02 3:4:5"))

    fmt.Println("Short Hour Minute Second: ", currentTime.Format("2006-01-02 3:4:5 PM"))

    fmt.Println("Short Hour Minute Second: ", currentTime.Format("2006-01-02 3:4:5 pm"))
}
```

Refs:

- https://yourbasic.org/golang/format-parse-string-time-date-example/
