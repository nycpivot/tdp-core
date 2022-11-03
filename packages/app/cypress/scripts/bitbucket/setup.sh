#!/bin/bash
set -euo pipefail

source $(dirname "$0")/../library.sh

BASE_URL=${BASE_URL:-"http://localhost:7990"}
PROJECT_KEY=ESBACK
REPO=catalog
REPO_FOLDER=${REPO_FOLDER:-"./../data/bitbucket/repo"}

#
# Execute a GET request on the Bitbucket server
#
# Params
# ------
#   $1 - contains the remaining path to the resource starting from the project key.
#        It will be prefixed by the projects api endpoint.
get() {
  echo "$(curl -s -o /dev/null -u esback:esback -w ''%{http_code}'' ${BASE_URL}/rest/api/1.0/projects/${1})"
  echo
  echo
}

#
# Execute a POST request on the Bitbucket server
#
# Params
# ------
#   $1 - contains the remaining path to the resource starting from the project key.
#        It will be prefixed by the projects api endpoint.
#   $2 - the data to post
post() {
  curl --silent --request POST \
    --url "${BASE_URL}/rest/api/latest/projects/${1}" \
    --user esback:esback \
    --header 'Accept: application/json' \
    --header 'Content-Type: application/json' \
    --data "${2}"
  echo
  echo
}

#
# Commit a file in the Bitbucket server
#
# Params
# ------
#   $1 the path to the file to commit in the repo: that will be the path of the file on the repo.
#   $2 the path to the local file that will be commited
#   $3 the commit message
commit() {
  curl --silent --request PUT \
    --url "${BASE_URL}/rest/api/latest/projects/${PROJECT_KEY}/repos/${REPO}/browse/${1}" \
    --user esback:esback \
    -F content=@${REPO_FOLDER}/${2} \
    -F branch=master \
    -F "message=${3}"
  echo
  echo
}

#
# Create a project in the Bitbucket server
#
# Params: none.
create_project() {
  printMessage "Checking if project already exists..."
  local status_code=$(get ${PROJECT_KEY})

  if [[ $status_code != "200" ]]; then
    printMessage "Creating a project..."
    post "" "{\"key\": \"${PROJECT_KEY}\", \"name\": \"esback\"}"
    printMessage "Project ${DATA_COLOR}${PROJECT_KEY} created."
  else
    printMessage "Project already exists."
  fi
}

#
# Create a repo in the Bitbucket server
#
# Params: none.
create_repository() {
  printMessage "Checking if repository already exists..."
  local status_code=$(get ${PROJECT_KEY}/repos/${REPO})

  if [[ $status_code != "200" ]]; then
    printMessage "Creating a repository..."
    post "${PROJECT_KEY}/repos" "{\"name\": \"catalog\", \"scmId\": \"git\", \"slug\": \"${REPO}\"}"
    printMessage "Repository ${DATA_COLOR}${REPO} created."
  else
    printMessage "Repository already exists."
  fi
}

#
# Create a Backstage catalog in the repo
#
# Params: none.
create_catalog() {
  printMessage "Checking if catalog already exists..."
  local status_code=$(get ${PROJECT_KEY}/repos/${REPO}/raw/catalog-info.yaml)

  if [[ $status_code != "200" ]]; then
    printMessage "Adding a catalog in the repository..."
    commit "catalog-info.yaml" "catalog-info.yaml" "Add catalog info"
    printMessage "Catalog added"
  else
    printMessage "Catalog already exists."
  fi
}

# Main section
create_project
create_repository
create_catalog

printMessage "That's All, Folks!"
