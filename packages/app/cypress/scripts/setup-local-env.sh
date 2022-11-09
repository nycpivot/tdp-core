#!/bin/bash
set -euo pipefail

DIR_PATH=$(dirname "$0")
ROOT_PATH=${DIR_PATH}/../../../..
source ${DIR_PATH}/library.sh

VAULT_ADDRESS="${VAULT_ADDRESS:-https://runway-vault-sfo.eng.vmware.com}"
VAULT_BASE_PATH="runway_concourse/esback"
VAULT_E2E_SECRETS="${VAULT_BASE_PATH}/e2e"
VAULT_GITLAB="${VAULT_BASE_PATH}/gitlab"

if ! command -v vault &> /dev/null
then
  fail "Please install vault in your environment and login to the esback vault at this address: ${DATA_COLOR}${VAULT_ADDRESS}."
fi

if ! command -v jq &> /dev/null
then
  fail "Please install jq in your environment."
fi

#
# Retrieve an e2e secret from vault
#
# Params
# ------
#  $1 the name of the secret to retrieve
get_e2e_secret() {
  value=$(vault read -address=${VAULT_ADDRESS} ${VAULT_E2E_SECRETS} -format=json | jq -r ".data.\"${1}\"")
  if [[ "$value" == "null" ]]
  then
    fail "Secret ${1} not found."
  fi
  echo $value
}

get_gitlab_token() {
  value=$(vault read -address=${VAULT_ADDRESS} ${VAULT_GITLAB} -format=json | jq -r ".data.\"${1}\"")
    if [[ "$value" == "null" ]]
    then
      fail "Secret ${1} not found."
    fi
    echo $value
}

current_branch() {
  echo $(git rev-parse --abbrev-ref HEAD)
}

# Setup environment
export BITBUCKET_SERVER_LICENSE=$(get_e2e_secret 'bitbucket_server_license')
export GITHUB_ENTERPRISE_TOKEN=$(get_e2e_secret "github_enterprise_token")
export GITHUB_TOKEN=$(get_e2e_secret "github_token")
export GITLAB_TOKEN=$(get_gitlab_token "core_token")
export BACKSTAGE_BASE_URL="${BACKSTAGE_BASE_URL:-http://esback:7007}"
if [[ -z "${GIT_BRANCH:-}" ]]
then
  export GIT_BRANCH="$(current_branch)"
fi

print_message "Clean up..."
echo $(pwd)
rm -rf ${HOME}/.esback-e2e/bitbucket
cd ${DIR_PATH}/..
echo $(pwd)
docker-compose stop esback
docker-compose stop bitbucket
docker-compose rm -f -v esback
docker-compose rm -f -v bitbucket
print_message "Clean up done."

print_message "Running esback on ${DATA_COLOR}${BACKSTAGE_BASE_URL}..."
docker-compose up -d esback