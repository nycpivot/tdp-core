#!/bin/bash
set -euo pipefail

echo "Installing typescript..."
npm install typescript@^4.4.3
echo
echo "Typescript installed"
echo

echo "Installing jq..."
apt update
apt install -y jq
echo
echo "jq installed."
echo

echo "Running Bitbucket setup..."
BASE_URL=http://bitbucket:7990 REPO_FOLDER=/e2e/cypress/data/bitbucket/repo /e2e/cypress/scripts/bitbucket/setup.sh
echo
echo "Bitbucket setup done"
echo

echo "Preparing some environment variables for e2e tests..."
bitbucket_token=(BASE_URL=http://bitbucket:7990 /e2e/cypress/scripts/bitbucket/generate-token.sh)
export BITBUCKET_TOKEN="$bitbucket_token"

echo
echo "Environment variables done"
echo

echo
echo "That's All, Folks!"
echo