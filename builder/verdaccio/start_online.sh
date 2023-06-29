#!/usr/bin/env bash
echo "---> Starting Verdaccio for local development..."

if [ $(node --version | cut -d. -f 1) != "v16" ]; then
	echo "Warning: it seems you are using node version $(node --version), expected major version 16"
fi

npx verdaccio --config online_config.yaml
