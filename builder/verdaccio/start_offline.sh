#!/usr/bin/env bash
set -eou pipefail

echo "---> Starting Verdaccio..."

./node_modules/forever/bin/forever start node_modules/verdaccio/bin/verdaccio --config offline_config.yaml
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

echo "Verdaccio started"
