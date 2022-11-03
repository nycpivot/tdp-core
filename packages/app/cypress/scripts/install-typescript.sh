#!/bin/bash
set -euo pipefail

source $(dirname "$0")/library.sh

print_message "Installing typescript..."
npm install typescript@^4.4.3
print_message "Typescript installed"
