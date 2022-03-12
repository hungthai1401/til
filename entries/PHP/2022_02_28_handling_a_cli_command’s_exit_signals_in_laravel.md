---
title: Handling a CLI command’s exit signals in Laravel
category: PHP
date: 2022-02-28
---

There are two common ways to stop a running command so:

1. CTRL+C on the terminal — This will send an interrupt signal (SIGINT) to the process
2. Run kill [process id] - This will send a termination signal (SIGTERM) to the process

Then we need to tell PHP to handle ticks using `declare(ticks = 1)` or `cntl_async_signals(true)`, and register two signal handlers using `pcntl_signal()`.

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MyWorker extends Command
{
    protected $signature = 'my-worker';

    protected $description = 'Demonstration worker that gracefully stops on exit';

    private $run = true;

    public function fire()
    {
        // PHP 7.0 and before can handle asynchronous signals with ticks
        declare(ticks=1);

        // PHP 7.1 and later can handle asynchronous signals natively
        pcntl_async_signals(true);

        pcntl_signal(SIGINT, [$this, 'shutdown']); // Call $this->shutdown() on SIGINT
        pcntl_signal(SIGTERM, [$this, 'shutdown']); // Call $this->shutdown() on SIGTERM

        $this->info('Worker started');

        $worker = new Worker();
        while ($this->run) {
            $worker->work();
        }

        $this->info('Worker stopped');
    }

    public function shutdown()
    {
        $this->info('Gracefully stopping worker...');

        // When set to false, worker will finish current item and stop.
        $this->run = false;

        // send SIGUSR1 to current process id
        // posix_* functions require the posix extension
        posix_kill(posix_getpid(), SIGUSR1);
    }
}
```

Refs:

- https://www.egeniq.com/blog/how-gracefully-stop-laravel-cli-command
