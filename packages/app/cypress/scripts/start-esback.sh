#!/bin/bash
set -euo pipefail

MSG_COLOR="\e[1;32m"
DATA_COLOR="\e[1;35m"
RESET_MARKER="\e[0m"

echo -e "${MSG_COLOR}Installing jq & curl...${RESET_MARKER}"
apt update
apt install -y curl jq
echo
echo -e "${MSG_COLOR}jq & curl installed.${RESET_MARKER}"
echo

echo -e "${MSG_COLOR}Waiting for Bitbucket...${RESET_MARKER}"
while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' -u esback:esback http://$BITBUCKET_HOST/rest/api/latest/projects)" != "200" ]]; do sleep 5; done
echo -e "${MSG_COLOR}Bitbucket ready !${RESET_MARKER}"
echo

echo -e "${MSG_COLOR}Running Bitbucket setup...${RESET_MARKER}"
BASE_URL=http://$BITBUCKET_HOST REPO_FOLDER=/e2e/cypress/data/bitbucket/repo /e2e/cypress/scripts/bitbucket/setup.sh
echo
echo -e "${MSG_COLOR}Bitbucket setup done${RESET_MARKER}"
echo

echo -e "${MSG_COLOR}Generating Bitbucket token...${RESET_MARKER}"
bitbucket_token=$(BASE_URL=http://$BITBUCKET_HOST /e2e/cypress/scripts/bitbucket/generate-token.sh)
echo
echo -e "${MSG_COLOR}Generated token: ${DATA_COLOR}$bitbucket_token${RESET_MARKER}"
echo

export BITBUCKET_TOKEN="$bitbucket_token"

node packages/backend --config app-config.e2e.yaml