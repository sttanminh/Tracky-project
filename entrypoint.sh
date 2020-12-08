#!/bin/bash
set -e

cd /github/workspace/frontend
npm install 
npm run build

python3 --version

cd /github/workspace/backend
serverless plugin install --name serverless-python-requirements
serverless plugin install --name serverless-finch
serverless config --key $AWS_ACCESS_KEY_ID --secret $AWS_SECRET_ACCESS_KEY

# deploy backend
serverless deploy --verbose

# deploy front end 
serverless client deploy --no-confirm