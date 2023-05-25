#!/usr/bin/env bash
set -eou pipefail

#echo "---> Downloading node headers"
#curl -sSL https://nodejs.org/download/release/v${NODE_VERSION}/node-v${NODE_VERSION}-headers.tar.gz \
#        -o core/registry/node_modules/verdaccio/nodejs.tar.gz

echo "---> Verdaccio cache setup..."
yarn cache clean --force
cd registry && npx forever start node_modules/verdaccio/bin/verdaccio --config online_config.yaml
cd /

if ! curl --connect-timeout 5 \
    --max-time 10 \
    --retry 5 \
    --retry-delay 0 \
    --retry-max-time 40 \
    --retry-all-errors \
    http://localhost:4873/-/ping > /dev/null 2>&1; then
        echo "ERROR: Failed to start internal npm registry"
        exit 1
fi

#sed -i "s|https://build-artifactory.eng.vmware.com/artifactory/api/npm/npm|http://localhost:4873|" core/yarn.lock
#sed -i "s|https://artifactory.eng.vmware.com/artifactory/api/npm/tpb-npm-local|http://localhost:4873|" core/yarn.lock
#
#sed -i "s|https://build-artifactory.eng.vmware.com/artifactory/api/npm/npm|http://localhost:4873|" core/packages/app/cypress/scripts/yarn.lock
#sed -i "s|https://artifactory.eng.vmware.com/artifactory/api/npm/tpb-npm-local|http://localhost:4873|" core/packages/app/cypress/scripts/yarn.lock

yarn --cwd builder install --registry="http://localhost:4873"

# Generate a portal to populate verdaccio cache too

echo "---> Generate portal..."
export TPB_APP_CONFIG=conf/app-config.yaml
export TPB_CONFIG=conf/default-manifest.yaml
yarn --cwd builder portal:prepare-pack

rm -rf builder/portal
rm -rf builder/node_modules
