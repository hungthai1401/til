---
title: Determine whether a listener should be queued in Laravel
category: PHP
date: 2022-02-28
---

`shouldQueue` method may be added to a listener to determine whether the listener should be queued. If the `shouldQueue` method returns false, the listener will not be executed (not be sent to queue)

```php
<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use Illuminate\Contracts\Queue\ShouldQueue;

class RewardGiftCard implements ShouldQueue
{
    /**
     * Reward a gift card to the customer.
     *
     * @param  \App\Events\OrderCreated  $event
     * @return void
     */
    public function handle(OrderCreated $event)
    {
        //
    }

    /**
     * Determine whether the listener should be queued.
     *
     * @param  \App\Events\OrderCreated  $event
     * @return bool
     */
    public function shouldQueue(OrderCreated $event)
    {
        return $event->order->subtotal >= 5000;
    }
}
```

Refs:

- https://laravel.com/docs/master/events#conditionally-queueing-listeners
- https://github.com/laravel/framework/blob/9.x/src/Illuminate/Events/Dispatcher.php#L562
