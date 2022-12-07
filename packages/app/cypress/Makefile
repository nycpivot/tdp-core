SHELL := /bin/bash

check_env:
ifndef BACKSTAGE_BASE_URL
	$(error Please define BACKSTAGE_BASE_URL in your environment)
endif

install_scripts:
	cd scripts && yarn

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

start-containers: check_env install_scripts clean-containers bitbucket esback

docker-tests: export BACKSTAGE_BASE_URL=http://esback:7007
docker-tests:
	$(MAKE) start-containers
	docker-compose rm -f -v cypress
	docker-compose run cypress

local-tests:
	CYPRESS_BITBUCKET_HOST=localhost:7990 npx cypress run --browser chrome

open-cypress-local:
	CYPRESS_BITBUCKET_HOST=localhost:7990 npx cypress open

# Pipelines commands
pipeline-bitbucket:
	@echo "Starting bitbucket"
	docker-compose -f ./docker-compose.ci.yaml up -d bitbucket

pipeline-esback:
	@echo "Starting esback"
	$(eval token="$(shell yarn --cwd scripts --silent generate-bitbucket-server-token)")
	BITBUCKET_TOKEN=$(token) docker-compose -f ./docker-compose.ci.yaml up -d esback

pipeline-start-containers: pipeline-bitbucket pipeline-esback

pipeline-tests: pipeline-start-containers
	@echo "Running pipeline tests"
	docker-compose -f ./docker-compose.ci.yaml run cypress