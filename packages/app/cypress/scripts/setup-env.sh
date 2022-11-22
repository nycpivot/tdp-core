#!/bin/bash
set -euo pipefail

DIR_PATH=$(dirname "$0")
source ${DIR_PATH}/library.sh

VAULT_ADDR="${VAULT_ADDR:-https://runway-vault-sfo.eng.vmware.com}"

if ! command -v vault &> /dev/null
then
  fail "Please install vault in your environment and login to the esback vault at this address: ${DATA_COLOR}${VAULT_ADDR}."
fi

vault_token=$(VAULT_ADDR="${VAULT_ADDR}" vault token lookup | grep -w id | awk '{print $2}')

current_branch() {
  echo $(git rev-parse --abbrev-ref HEAD)
}

# Setup environment
export BITBUCKET_SERVER_LICENSE=$(VAULT_ADDR=${VAULT_ADDR} VAULT_TOKEN=${vault_token} npx ts-node ${DIR_PATH}/src/vault/readSecret.ts runway_concourse/esback/e2e bitbucket_server_license)
export GITHUB_ENTERPRISE_TOKEN=$(VAULT_ADDR=${VAULT_ADDR} VAULT_TOKEN=${vault_token} npx ts-node ${DIR_PATH}/src/vault/readSecret.ts runway_concourse/esback/e2e github_enterprise_token)
export GITHUB_TOKEN=$(VAULT_ADDR=${VAULT_ADDR} VAULT_TOKEN=${vault_token} npx ts-node ${DIR_PATH}/src/vault/readSecret.ts runway_concourse/esback/e2e github_token)
export GITLAB_TOKEN=$(VAULT_ADDR=${VAULT_ADDR} VAULT_TOKEN=${vault_token} npx ts-node ${DIR_PATH}/src/vault/readSecret.ts runway_concourse/esback/gitlab core_token)

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
