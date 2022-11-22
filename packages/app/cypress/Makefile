SHELL := /bin/bash

check_env:
ifndef VAULT_ADDR
	$(error Please define VAULT_ADDR in your environment)
endif
ifndef BACKSTAGE_BASE_URL
	$(error Please define BACKSTAGE_BASE_URL in your environment)
endif

start-containers: check_env
	yarn --cwd scripts start-containers

docker-tests: start-containers
	docker-compose rm -f -v cypress
	docker-compose run cypress

local-tests:
	CYPRESS_baseUrl=http://localhost:7007 ./scripts/run-tests.sh

open-cypress-local:
	$(shell CYPRESS_baseUrl=http://localhost:7007 CYPRESS_BITBUCKET_HOST=localhost:7990 npx cypress open)
