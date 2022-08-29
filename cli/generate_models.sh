#!/bin/bash

set -euo pipefail

# Plugin config models
quicktype -s schema config.schema.json -o models.go --just-types-and-package --package=main -t EsbackConfig
sed -i '' 's/json\:"\(.*\)\"/json:"\1" yaml:"\1"/' models.go
gofmt -w models.go
