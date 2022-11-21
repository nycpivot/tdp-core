#!/bin/bash
set -euo pipefail

source $(dirname "$0")/library.sh

print_message "Installing curl..."
apt update
apt install -y curl
echo
print_message "curl installed."

print_message "Waiting for Bitbucket..."
while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' -u esback:esback http://${BITBUCKET_HOST}/rest/api/latest/projects)" != "200" ]]; do sleep 5; done
print_message "Bitbucket ready !"

cd /scripts
yarn install
bitbucket_token=$(npx ts-node src/bitbucket-server/generateToken.ts)
print_message "Generated token: ${DATA_COLOR}${bitbucket_token}"
cd -

export BITBUCKET_TOKEN="${bitbucket_token}"

node packages/backend --config app-config.e2e.yaml