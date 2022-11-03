#!/bin/bash
set -euo pipefail

source $(dirname "$0")/library.sh

printMessage "Installing typescript..."
npm install typescript@^4.4.3
printMessage "Typescript installed"

printMessage "Waiting for esback server..."
while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' $CYPRESS_baseUrl)" != "200" ]]; do sleep 5; done
printMessage "esback is ready !"

cypress run --browser chrome