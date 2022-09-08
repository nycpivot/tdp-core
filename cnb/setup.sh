#!/usr/bin/env bash
export DOCKER_BUILDKIT=1
docker build -t esback-stack-runner --target run -f cnb/Dockerfile .
docker build -t esback-stack-builder --target build -f cnb/Dockerfile .

pack builder create esback-builder --config cnb/builder.toml
