#!/bin/bash
set -euo pipefail

source $(dirname "$0")/library.sh

export BACKSTAGE_BASE_URL=http://localhost:7007
export CYPRESS_baseUrl=${BACKSTAGE_BASE_URL}

# Go!
print_message "Let's rock!"
source $(dirname "$0")/run-tests.sh
print_message "That's All, Folks !"

