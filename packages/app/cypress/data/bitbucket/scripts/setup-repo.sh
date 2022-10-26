#!/bin/bash
set -euo pipefail

BASE_URL="http://localhost:7990"

echo "Create a project"
echo

curl --request POST \
  --url "{$BASE_URL}/rest/api/latest/projects" \
  --user esback:esback \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "key": "ESBACK",
  "name": "esback"
}'


echo
echo
echo "That's All, Folks!"
