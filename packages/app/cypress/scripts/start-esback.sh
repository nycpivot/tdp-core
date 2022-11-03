#!/bin/bash
set -euo pipefail

source $(dirname "$0")/library.sh

printMessage "Installing jq & curl..."
apt update
apt install -y curl jq
echo
printMessage "jq & curl installed."
echo

printMessage "Waiting for Bitbucket..."
while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' -u esback:esback http://${BITBUCKET_HOST}/rest/api/latest/projects)" != "200" ]]; do sleep 5; done
printMessage "Bitbucket ready !"
echo

printMessage "Running Bitbucket setup..."
BASE_URL=http://${BITBUCKET_HOST} REPO_FOLDER=/e2e/cypress/data/bitbucket/repo /e2e/cypress/scripts/bitbucket/setup.sh
echo
printMessage "Bitbucket setup done"
echo

printMessage "Generating Bitbucket token..."
bitbucket_token=$(BASE_URL=http://${BITBUCKET_HOST} /e2e/cypress/scripts/bitbucket/generate-token.sh)
echo
printMessage "Generated token: ${DATA_COLOR}${bitbucket_token}"
echo

export BITBUCKET_TOKEN="${bitbucket_token}"

node packages/backend --config app-config.e2e.yaml