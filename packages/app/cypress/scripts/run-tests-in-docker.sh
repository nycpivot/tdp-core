#!/bin/bash
set -euo pipefail

source $(dirname "$0")/setup-local-env.sh

# Go!

cd $(dirname "$0")/..
print_message "Let's rock!"
docker-compose rm -f -v cypress

docker-compose run cypress