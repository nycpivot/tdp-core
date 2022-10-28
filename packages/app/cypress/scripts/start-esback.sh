#!/bin/bash
set -euo pipefail

echo "Installing jq & curl..."
apt update
apt install -y curl jq
echo
echo "jq & curl installed."
echo

echo "Waiting for Bitbucket..."
while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' -u esback:esback http://$BITBUCKET_HOST/rest/api/latest/projects)" != "200" ]]; do sleep 5; done
echo
echo "Bitbucket ready !"
echo

echo "Running Bitbucket setup..."
BASE_URL=http://$BITBUCKET_HOST REPO_FOLDER=/e2e/cypress/data/bitbucket/repo /e2e/cypress/scripts/bitbucket/setup.sh
echo
echo "Bitbucket setup done"
echo

echo "Generating Bitbucket token..."
bitbucket_token=$(BASE_URL=http://$BITBUCKET_HOST /e2e/cypress/scripts/bitbucket/generate-token.sh)
echo
echo "Generated token: $bitbucket_token"
echo

export BITBUCKET_TOKEN="$bitbucket_token"

node packages/backend --config app-config.e2e.yaml