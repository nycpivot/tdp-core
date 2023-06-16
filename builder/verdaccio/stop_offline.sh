#!/usr/bin/env bash
set -eou pipefail

echo "---> Stopping Verdaccio..."
./node_modules/forever/bin/forever stop node_modules/verdaccio/bin/verdaccio --config offline_config.yaml
