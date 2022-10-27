#!/bin/bash
set -euo pipefail

BASE_URL="http://localhost:7990"
PROJECT_KEY=ESBACK
REPO=catalog

echo "Creating a project..."
echo

curl --request POST \
  --url "$BASE_URL/rest/api/latest/projects" \
  --user esback:esback \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data "{
  \"key\": \"$PROJECT_KEY\",
  \"name\": \"esback\"
}"

echo
echo
echo "Project $PROJECT_KEY created."
echo

echo "Creating a repository..."
echo

curl --request POST \
  --url "$BASE_URL/rest/api/latest/projects/$PROJECT_KEY/repos" \
  --user esback:esback \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data "{
  \"name\": \"catalog\",
  \"scmId\": \"git\",
  \"slug\": \"$REPO\"
}"

echo
echo
echo "Repository $REPO created."
echo

echo "Adding a catalog in the repository..."
echo

curl --request PUT \
  --url "$BASE_URL/rest/api/latest/projects/$PROJECT_KEY/repos/$REPO/browse/catalog-info.yaml" \
  --user esback:esback \
  -F content=@../../data/bitbucket/repo/catalog-info.yaml \
  -F branch=master \
  -F 'message=Add catalog info'

echo
echo
echo "Catalog added"

echo
echo
echo "That's All, Folks!"
