#!/bin/bash
set -euo pipefail

echo Syncing S3...
aws s3 sync ./build s3://spiria.grantconnect.ca --region ca-central-1

echo Refreshing CloudFront...
aws cloudfront create-invalidation --distribution-id E1ML9EPDK2XZWV --paths "/index.html"

echo App deployed.
