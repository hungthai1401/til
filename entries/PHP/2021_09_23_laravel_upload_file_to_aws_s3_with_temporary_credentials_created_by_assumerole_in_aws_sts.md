---
title: Laravel upload file to AWS s3 with temporary credentials created by AssumeRole in AWS STS
category: PHP
date: 2021-09-23
---

Extend the `Illuminate\Filesystem\FilesystemManager` and overwrite s3 driver creation strategy.

```php
use Aws\S3\S3Client;
use Aws\Sts\StsClient;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Filesystem\FilesystemManager as BaseFilesystemManager;
use League\Flysystem\AwsS3v3\AwsS3Adapter as S3Adapter;

class FilesystemManager extends BaseFilesystemManager
{
    /**
     * Create an instance of the Amazon S3 driver.
     *
     * @param  array  $config
     * @return Cloud
     */
    public function createS3Driver(array $config): Cloud
    {
        $s3Config = $this->formatS3Config($config);
        $stsClient = new StsClient($s3Config);

        $credentials = $stsClient->assumeRole([
            'RoleArn' => 'YOUR_AWS_ROLE_ARN',
            'RoleSessionName' => 'YOUR_AWS_ROLE_SESSION_NAME',
        ]);

        $s3Config['key'] = $credentials['Credentials']['AccessKeyId'];
        $s3Config['secret'] = $credentials['Credentials']['SecretAccessKey'];
        $s3Config['token'] = $credentials['Credentials']['SessionToken'];

        $root = $s3Config['root'] ?? null;

        $options = $config['options'] ?? [];

        $streamReads = $config['stream_reads'] ?? false;

        return $this->adapt($this->createFlysystem(
            new S3Adapter(new S3Client($s3Config), $s3Config['bucket'], $root, $options, $streamReads),
            $config,
        ));
    }
}
```

Register Service Provider

```php
/**
 * Register any application services.
 *
 * @return void
 */
public function register(): void
{
    $this->app->singleton('filesystem', static function ($app) {
        return new FilesystemManager($app);
    });
}
```

Refs:

- https://docs.aws.amazon.com/code-samples/latest/catalog/php-sts-AssumeRole.php.html
