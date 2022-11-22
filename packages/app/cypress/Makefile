SHELL := /bin/bash


docker-tests:
	./scripts/run-tests-in-docker.sh

start-containers:
	BACKSTAGE_BASE_URL=http://localhost:7007 ./scripts/start-containers.sh

local-tests:
	CYPRESS_baseUrl=http://localhost:3000 ./scripts/run-tests.sh

open-cypress-local:
	$(shell CYPRESS_baseUrl=http://localhost:3000 CYPRESS_BITBUCKET_HOST=localhost:7990 npx cypress open)
