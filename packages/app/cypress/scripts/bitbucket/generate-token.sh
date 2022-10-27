#!/bin/bash
set -euo pipefail

BASE_URL=${BASE_URL:-"http://localhost:7990"}
PROJECT_KEY=ESBACK

curl --silent --request PUT \
  --url "$BASE_URL/rest/access-tokens/latest/projects/$PROJECT_KEY" \
  --user esback:esback \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "expiryDays": 2154,
  "name": "My access token",
  "permissions": [
    "REPO_ADMIN",
    "PROJECT_READ"
  ]
}' | jq .token