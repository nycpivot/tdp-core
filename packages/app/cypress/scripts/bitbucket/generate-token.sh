#!/bin/bash
set -euo pipefail

BASE_URL=${BASE_URL:-"http://localhost:7990"}

token=$(curl --silent --request PUT \
  --url "${BASE_URL}/rest/access-tokens/latest/users/esback" \
  --user esback:esback \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "expiryDays": 2154,
  "name": "My access token",
  "permissions": [
    "REPO_ADMIN",
    "PROJECT_ADMIN"
  ]
}' | jq .token)

echo "$token" | tr -d '"'