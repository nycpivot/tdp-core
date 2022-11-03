#!/bin/bash
set -euo pipefail

source $(dirname "$0")/library.sh

print_message "Installing typescript..."
npm install typescript@^4.4.3
print_message "Typescript installed"

print_message "Waiting for esback server (it might take a moment)..."
while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' $CYPRESS_baseUrl)" != "200" ]]; do sleep 5; done
print_message "esback is ready !"

cypress run --browser chrome