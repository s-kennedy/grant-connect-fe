#!/usr/bin/env bash
set -euo pipefail

docker build \
  --build-arg AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
  --build-arg AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
  --build-arg REACT_APP_SERVER_BASE_URL=${REACT_APP_SERVER_BASE_URL} \
  --file Dockerfile.prod \
  --tag grant-connect-app-prod:latest \
  .

docker run --rm grant-connect-app-prod:latest sh .ci/deploy_qa.sh

# Cleanup on CI
docker rmi grant-connect-app-prod:latest
