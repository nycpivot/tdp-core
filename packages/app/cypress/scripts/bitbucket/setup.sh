#!/bin/bash
set -euo pipefail

MSG_COLOR="\e[1;32m"
DATA_COLOR="\e[1;35m"
RESET_MARKER="\e[0m"

BASE_URL=${BASE_URL:-"http://localhost:7990"}
PROJECT_KEY=ESBACK
REPO=catalog
REPO_FOLDER=${REPO_FOLDER:-"./../data/bitbucket/repo"}

echo -e "${MSG_COLOR}Checking if project already exists..."
status_code=$(curl -s -o /dev/null -u esback:esback -w ''%{http_code}'' $BASE_URL/rest/api/1.0/projects/$PROJECT_KEY)

if [[ $status_code != "200" ]]
then
  echo -e "${MSG_COLOR}Creating a project...${RESET_MARKER}"
    echo

    curl --silent --request POST \
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
    echo -e "${MSG_COLOR}Project ${DATA_COLOR}$PROJECT_KEY created.${RESET_MARKER}"
    echo
else
  echo -e "${MSG_COLOR}Project already exists.${RESET_MARKER}"
  echo
fi


echo -e "${MSG_COLOR}Checking if repository already exists...${RESET_MARKER}"
status_code=$(curl -s -o /dev/null -u esback:esback -w ''%{http_code}'' $BASE_URL/rest/api/1.0/projects/$PROJECT_KEY/repos/${REPO})

if [[ $status_code != "200" ]]
then
  echo -e "${MSG_COLOR}Creating a repository...${RESET_MARKER}"
  echo

  curl --silent --request POST \
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
  echo -e "${MSG_COLOR}Repository ${DATA_COLOR}$REPO created.${RESET_MARKER}"
  echo
else
  echo -e "${MSG_COLOR}Repository already exists.${RESET_MARKER}"
  echo
fi

echo -e "${MSG_COLOR}Checking if catalog already exists...${RESET_MARKER}"

status_code=$(curl -s -o /dev/null -u esback:esback -w ''%{http_code}'' $BASE_URL/rest/api/1.0/projects/$PROJECT_KEY/repos/${REPO}/raw/catalog-info.yaml)

if [[ $status_code != "200" ]]
then
  echo -e "${MSG_COLOR}Adding a catalog in the repository...${RESET_MARKER}"
  echo
  curl --silent --request PUT \
    --url "$BASE_URL/rest/api/latest/projects/$PROJECT_KEY/repos/$REPO/browse/catalog-info.yaml" \
    --user esback:esback \
    -F content=@$REPO_FOLDER/catalog-info.yaml \
    -F branch=master \
    -F 'message=Add catalog info'

  echo
  echo
  echo -e "${MSG_COLOR}Catalog added${RESET_MARKER}"
else
    echo -e "${MSG_COLOR}Catalog already exists.${RESET_MARKER}"
    echo
fi


echo
echo
echo -e "${MSG_COLOR}That's All, Folks!${RESET_MARKER}"