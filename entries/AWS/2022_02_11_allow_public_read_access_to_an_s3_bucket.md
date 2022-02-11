---
title: Allow public read access to an S3 Bucket
category: AWS
date: 2022-02-11
---

1. Open the AWS S3 console and click on the bucket's name
2. Click on the `Permissions` tab
3. Find the `Block public access (bucket settings)` section, click on the `Edit` button, uncheck the checkboxes and click on `Save changes`

![S3 Block](https://bobbyhadz.com/images/blog/aws-s3-allow-public-read-access/uncheck-checkboxes.webp)

4. In the `Permissions` tab scroll down to the `Bucket policy` section and click on the `Edit` button. Paste the following policy into the textarea to grant public read access to all files in your S3 bucket.

> **_NOTE:_** Replace the `YOUR_BUCKET_NAME` placeholder with your bucket's name.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

Save the changes you've made to the bucket's policy and your bucket will have public read access enabled.

5. (Optional) If you need to access your bucket with http request from the browser, you have update the bucket's Cross-origin resource sharing (CORS) options to allow your frontend's requests

- In the `Permissions` tab of your S3 bucket, scroll down to the `Cross-origin resource sharing (CORS)` section and click on the `Edit` button

- Paste the following JSON into the textarea and save the changes

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```
