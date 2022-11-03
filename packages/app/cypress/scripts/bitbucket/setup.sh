#!/bin/bash
set -euo pipefail


BASE_URL=${BASE_URL:-"http://localhost:7990"}
PROJECT_KEY=ESBACK
REPO=catalog
REPO_FOLDER=${REPO_FOLDER:-"./../data/bitbucket/repo"}

MSG_COLOR="\e[1;32m"
DATA_COLOR="\e[1;35m"
RESET_MARKER="\e[0m"

printMessage() {
  echo -e "${MSG_COLOR}$1${RESET_MARKER}"
}

create_project() {
  printMessage "Checking if project already exists..."
  local status_code=$(curl -s -o /dev/null -u esback:esback -w ''%{http_code}'' $BASE_URL/rest/api/1.0/projects/$PROJECT_KEY)

  if [[ $status_code != "200" ]]
  then
    printMessage "Creating a project..."
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
      printMessage "Project ${DATA_COLOR}$PROJECT_KEY created."
      echo
  else
    printMessage  "Project already exists."
    echo
  fi
}

create_repository() {
  printMessage  "Checking if repository already exists..."
  local status_code=$(curl -s -o /dev/null -u esback:esback -w ''%{http_code}'' $BASE_URL/rest/api/1.0/projects/$PROJECT_KEY/repos/${REPO})

  if [[ $status_code != "200" ]]
  then
    printMessage "Creating a repository..."
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
    printMessage "Repository ${DATA_COLOR}$REPO created."
    echo
  else
    printMessage "Repository already exists."
    echo
  fi
}

create_catalog() {
  printMessage "Checking if catalog already exists..."

  local status_code=$(curl -s -o /dev/null -u esback:esback -w ''%{http_code}'' $BASE_URL/rest/api/1.0/projects/$PROJECT_KEY/repos/${REPO}/raw/catalog-info.yaml)

  if [[ $status_code != "200" ]]
  then
    printMessage "Adding a catalog in the repository..."
    echo
    curl --silent --request PUT \
      --url "$BASE_URL/rest/api/latest/projects/$PROJECT_KEY/repos/$REPO/browse/catalog-info.yaml" \
      --user esback:esback \
      -F content=@$REPO_FOLDER/catalog-info.yaml \
      -F branch=master \
      -F 'message=Add catalog info'

    echo
    echo
    printMessage "Catalog added"
  else
      printMessage "Catalog already exists."
      echo
  fi
}

create_project
create_repository
create_catalog

echo
echo
printMessage "That's All, Folks!"