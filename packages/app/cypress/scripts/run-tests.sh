#!/bin/bash
set -euo pipefail

source $(dirname "$0")/library.sh

print_message "Waiting for esback server on ${CYPRESS_baseUrl} (it might take a moment)..."
while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' ${CYPRESS_baseUrl})" != "200" ]]; do sleep 5; done
print_message "esback is ready !"

print_message "bitbucket is on: ${BITBUCKET_HOST}!"

CYPRESS_BITBUCKET_HOST=${BITBUCKET_HOST} npx cypress run --browser chrome