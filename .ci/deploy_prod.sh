#!/bin/bash
set -euo pipefail

echo Syncing S3...
aws s3 sync ./build s3://next.grantconnect.ca --region ca-central-1

echo Refreshing CloudFront...
aws cloudfront create-invalidation --distribution-id EJXOIG8RO4UGN --paths "/index.html"

echo App deployed.
