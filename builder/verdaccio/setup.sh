#!/usr/bin/env bash
set -eou pipefail

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
	http://localhost:4873/-/ping >/dev/null 2>&1; then
	echo "ERROR: Failed to start internal npm registry"
	exit 1
fi

yarn --cwd builder install

# Generate a portal to populate verdaccio cache too
echo "---> Generate portal..."
export TPB_APP_CONFIG=conf/app-config.yaml
export TPB_CONFIG=conf/default-manifest.yaml
yarn --cwd builder portal:prepare-pack

rm -rf builder/portal
rm -rf builder/node_modules
