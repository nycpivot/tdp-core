#!/bin/bash
set -euo pipefail

source $(dirname "$0")/library.sh

print_message "Installing jq & curl..."
apt update
apt install -y curl jq
echo
print_message "jq & curl installed."

print_message "Waiting for Bitbucket..."
while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' -u esback:esback http://${BITBUCKET_HOST}/rest/api/latest/projects)" != "200" ]]; do sleep 5; done
print_message "Bitbucket ready !"

print_message "Running Bitbucket setup..."
BASE_URL=http://${BITBUCKET_HOST} REPO_FOLDER=/e2e/cypress/data/bitbucket/repo /e2e/cypress/scripts/bitbucket/setup.sh
echo
print_message "Bitbucket setup done"

print_message "Generating Bitbucket token..."
bitbucket_token="$(BASE_URL=http://${BITBUCKET_HOST} /e2e/cypress/scripts/bitbucket/generate-token.sh)"
print_message "Generated token: ${DATA_COLOR}${bitbucket_token}"

export BITBUCKET_TOKEN="${bitbucket_token}"

node packages/backend --config app-config.e2e.yaml