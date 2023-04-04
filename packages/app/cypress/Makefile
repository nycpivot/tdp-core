SHELL := /bin/bash

check_env:
ifndef BACKSTAGE_BASE_URL
	$(error Please define BACKSTAGE_BASE_URL in your environment)
endif

install_scripts:
	cd scripts && yarn

stop-tpb:
	docker-compose stop tpb

delete-tpb: stop-tpb
	docker-compose rm -fv tpb

stop-bitbucket:
	docker-compose stop bitbucket

delete-bitbucket: stop-bitbucket
	docker-compose rm -fv bitbucket
	rm -rf ${HOME}/.tpb-e2e/bitbucket

stop-ldap-server:
	docker-compose stop openldap

clean-containers: delete-tpb delete-bitbucket

bitbucket:
	eval `yarn --cwd scripts --silent build-environment bitbucketServer` && \
  docker-compose up -d bitbucket

ldap-server:
	docker-compose up -d openldap

tpb:
	$(eval token="$(shell yarn --cwd scripts --silent generate-bitbucket-server-token)")
	@eval `yarn --cwd scripts --silent build-environment tpb` && \
	BITBUCKET_TOKEN=$(token) docker-compose up -d tpb

start-containers: check_env install_scripts clean-containers bitbucket tpb

docker-tests: export BACKSTAGE_BASE_URL=http://tpb:7007
docker-tests:
	$(MAKE) start-containers
	docker-compose rm -f -v cypress
	@eval `yarn --cwd scripts --silent build-environment cypress` && \
	docker-compose run cypress

local-tests:
	@eval `yarn --cwd scripts --silent build-environment cypress` && \
	CYPRESS_ESBACK_BACKEND_URL=http://localhost:7007 npx cypress run --browser chrome

specific-test:
	@eval `yarn --cwd scripts --silent build-environment cypress` && \
	CYPRESS_ESBACK_BACKEND_URL=http://localhost:7007 npx cypress run --browser chrome --spec "cypress/integration/$(test).ts"

open-cypress-local:
	@eval `yarn --cwd scripts --silent build-environment cypress` && \
	CYPRESS_ESBACK_BACKEND_URL=http://localhost:7007 npx cypress open

# Pipelines commands
pipeline-bitbucket:
	@echo "Starting bitbucket"
	docker-compose -f ./docker-compose.ci.yaml up -d bitbucket

pipeline-tpb:
	@echo "Starting tpb"
	$(eval token="$(shell yarn --cwd scripts --silent generate-bitbucket-server-token)")
	BITBUCKET_TOKEN=$(token) docker-compose -f ./docker-compose.ci.yaml up -d tpb

pipeline-start-containers: pipeline-bitbucket pipeline-tpb

pipeline-tests: pipeline-start-containers
	@echo "Running pipeline tests"
	docker-compose -f ./docker-compose.ci.yaml run cypress
