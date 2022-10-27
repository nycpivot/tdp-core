#!/bin/bash
set -euo pipefail

echo "Installing typescript..."
npm install typescript@^4.4.3
echo
echo "Typescript installed"
echo

echo "Waiting for esback server..."
while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' $CYPRESS_baseUrl)" != "200" ]]; do sleep 5; done
echo
echo "esback ready !"
echo


cypress run --browser chrome