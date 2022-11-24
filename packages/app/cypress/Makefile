SHELL := /bin/bash

check_env:
ifndef BACKSTAGE_BASE_URL
	$(error Please define BACKSTAGE_BASE_URL in your environment)
endif

delete-esback:
	docker-compose stop esback
	docker-compose rm -fv esback

delete-bitbucket:
	docker-compose stop bitbucket
	docker-compose rm -fv bitbucket
	rm -rf ${HOME}/.esback-e2e/bitbucket

clean-containers: delete-esback delete-bitbucket

bitbucket:
	eval `yarn --cwd scripts --silent build-environment bitbucket` && \
  docker-compose up -d bitbucket

esback:
	$(eval token="$(shell yarn --cwd scripts --silent generate-bitbucket-server-token)")
	@eval `yarn --cwd scripts --silent build-environment esback` && \
	BITBUCKET_TOKEN=$(token) docker-compose up -d esback

start-containers: check_env clean-containers bitbucket esback

docker-tests: export BACKSTAGE_BASE_URL=http://esback:7007
docker-tests:
	$(MAKE) start-containers
	docker-compose rm -f -v cypress
	docker-compose run cypress

local-tests: export BITBUCKET_HOST = localhost:7990
local-tests:
	CYPRESS_baseUrl=http://localhost:7007 CYPRESS_BITBUCKET_HOST=localhost:7990 npx cypress run --browser chrome

open-cypress-local:
	CYPRESS_baseUrl=http://localhost:7007 CYPRESS_BITBUCKET_HOST=localhost:7990 npx cypress open

# Pipelines commands
start-containers-with-current-environment:
	docker-compose up -d bitbucket
	$(eval token="$(shell yarn --cwd scripts --silent generate-bitbucket-server-token)")
	BITBUCKET_TOKEN=$(token) docker-compose up -d esback

docker-tests-with-current-environment: start-containers-with-current-environment
	docker-compose rm -f -v cypress
	docker-compose run cypress
