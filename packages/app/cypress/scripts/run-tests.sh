#!/bin/bash
set -euo pipefail

MSG_COLOR="\e[1;32m"
DATA_COLOR="\e[1;35m"
RESET_MARKER="\e[0m"

echo -e "${MSG_COLOR}Installing typescript...${RESET_MARKER}"
npm install typescript@^4.4.3
echo
echo -e "${MSG_COLOR}Typescript installed${RESET_MARKER}"
echo

echo -e "${MSG_COLOR}Waiting for esback server...${RESET_MARKER}"
while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' $CYPRESS_baseUrl)" != "200" ]]; do sleep 5; done
echo
echo -e "${MSG_COLOR}esback ready !${RESET_MARKER}"
echo

cypress run --browser chrome