---
title: Run cronjob along with php-fpm
category: Docker
date: 2021-09-08
---

Make crontab with content in `.docker/php/crontab`

```
* * * * * /usr/local/bin/php /var/www/artisan schedule:run >> /var/log/cron.log 2>&1
```

Update Dockerfile

```sh
RUN crontab -u www-data -l > /var/spool/cron/crontabs/www-data \
    && cat .docker/php/crontab > /var/spool/cron/crontabs/www-data \
    && crontab -u www-data /var/spool/cron/crontabs/www-data \
    && touch /var/log/cron.log \
    && chown www-data:www-data /var/log/cron.log

...

CMD cron && docker-php-entrypoint php-fpm
```
