#!/bin/bash
set -euo pipefail

source $(dirname "$0")/library.sh

cd /scripts
yarn install
print_message "Looking for bitbucket server token..."
bitbucket_token=$(npx ts-node src/bitbucket-server/generateToken.ts)
print_message "Generated token: ${DATA_COLOR}${bitbucket_token}"
cd -

export BITBUCKET_TOKEN="${bitbucket_token}"

node packages/backend --config app-config.e2e.yaml