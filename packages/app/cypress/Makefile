SHELL := /bin/bash


docker-tests:
	./scripts/run-tests-in-docker.sh

setup-docker-env:
	BACKSTAGE_BASE_URL=http://localhost:7007 ./scripts/setup-local-env.sh

local-tests:
	CYPRESS_baseUrl=http://localhost:7007 ./scripts/run-tests.sh
