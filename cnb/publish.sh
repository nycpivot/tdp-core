#!/usr/bin/env bash
export DOCKER_BUILDKIT=1
docker build -t harbor-repo.vmware.com/esback/cnb-stack-runner --target run -f cnb/Dockerfile .
docker build -t harbor-repo.vmware.com/esback/cnb-stack-builder --target build -f cnb/Dockerfile .

docker push harbor-repo.vmware.com/esback/cnb-stack-runner:latest
docker push harbor-repo.vmware.com/esback/cnb-stack-builder:latest

pack builder create harbor-repo.vmware.com/esback/cnb-builder --config cnb/builder.toml
docker push harbor-repo.vmware.com/esback/cnb-builder:latest
