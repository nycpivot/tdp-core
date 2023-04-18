SHELL = /bin/bash
username ?= $(shell whoami)
concourse_endpoint ?= "https://runway-ci-sfo.eng.vmware.com"
VAULT_ADDR ?= "https://runway-vault-sfo.eng.vmware.com"
CYPRESS_baseUrl ?= "http://localhost:3000"

.PHONY: help
help: ## # Display this help.
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sed -n 's/^\(.*\): \(.*\)##\(.*\)/\1\3/p' \
		| sort \
		| column -t  -s '#'

build: clean install compile lint check-prettier ## # Build the whole app.
	yarn build

compile: ## # Compile the typescript code.
	yarn tsc

image: build	## # Build a docker image of the whole app.
	docker build -t tpb:integration -f packages/backend/Dockerfile .

clean: ## # Clean everything.
	yarn clean

install:	## # Install the npm dependencies.
	yarn install

lint:	## # Run the linter.
	yarn lint:all

fix-lint:	## # Run the linter and fix automatically what can be fixed.
	yarn lint:all --fix

check-prettier:	## # Check that the files are prettified.
	yarn prettier:check

prettier:	## # Run prettier on the files.
	yarn prettier --write .

test:	## # Run the unit tests.
	yarn test:all

start: install	## # Run the server locally in dev mode.
	yarn dev

login-to-vault:	# Log in to Vault if not yet already.
ifeq (, $(findstring expire_time, $(shell vault token lookup -address ${VAULT_ADDR} 2>/dev/null | grep expire_time)))
	@echo "Let's connect to Vault"
	@vault login -address=${VAULT_ADDR} -method=ldap username=$(username)
else
	@echo "Already logged in to vault"
endif

e2e-environment: image login-to-vault  ## # Build a whole docker environment where you can run the docker-local e2e tests.
	BACKSTAGE_BASE_URL=http://localhost:7007 VAULT_ADDR=$(VAULT_ADDR) $(MAKE) -C packages/app/cypress start-containers

docker-docker-e2e: image login-to-vault	## # Build a whole docker environment and run the e2e tests in a docker container like the pipeline.
	VAULT_ADDR=$(VAULT_ADDR) $(MAKE) -C packages/app/cypress docker-tests

docker-local-e2e: login-to-vault ## # Run the e2e tests against an e2e environment built with make e2e-environment.
	BITBUCKET_CATALOG_PREFIX="bitbucket:7990" VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=http://localhost:7007 $(MAKE) -C packages/app/cypress local-tests

dev-e2e: login-to-vault	## # Run the e2e tests against the development environment launched with make start.
	BITBUCKET_CATALOG_PREFIX="localhost:7990" VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=http://localhost:3000 $(MAKE) -C packages/app/cypress local-tests

docker-local-specific-test: login-to-vault	## # Run a specific e2e test built with make e2e-environment. Provide the test name with the test variable.
	BITBUCKET_CATALOG_PREFIX="bitbucket:7990" VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=http://localhost:7007 $(MAKE) -C packages/app/cypress specific-test test=$(test)

dev-specific-test: login-to-vault ## # Run a specific e2e test against the development environment launched with make start. Provide the test name with the test variable.
	BITBUCKET_CATALOG_PREFIX="localhost:7990" VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=http://localhost:3000 $(MAKE) -C packages/app/cypress specific-test test=$(test)

open-docker-local-e2e: login-to-vault ## # Open Cypress UI against an e2e environment built with make e2e-environment.
	BITBUCKET_CATALOG_PREFIX="bitbucket:7990" VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=http://localhost:7007 $(MAKE) -C packages/app/cypress open-cypress-local

open-dev-e2e: login-to-vault ## # Open Cypress UI against the development environment launched with make start.
	BITBUCKET_CATALOG_PREFIX="localhost:7990" VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=http://localhost:3000 $(MAKE) -C packages/app/cypress open-cypress-local

create-pipeline:	## # Create a Concourse pipeline for your current branch. Provide the name of the pipeline with the name variable.
	$(eval branch="$(shell git rev-parse --abbrev-ref HEAD)")
	fly -t esback set-pipeline -p "$(name)" -c ci/pipeline.yml -v git_branch=$(branch) -v initial_version=0.0.0
	fly -t esback unpause-pipeline -p "$(name)"

destroy-pipeline: ## # Destroy a Concourse pipeline. Provide the name of the pipeline with the name variable.
	fly -t esback destroy-pipeline -p "$(name)"

setup: install login-to-vault ## # Create an .envrc file that can be sourced with the variables used in the e2e tests. Useful if you want to run your dev environment with the same config than the e2e environment.
	$(MAKE) -C packages/app/cypress install_scripts
	VAULT_ADDR=$(VAULT_ADDR) LDAP_ENDPOINT="ldap://localhost:1389" BITBUCKET_HOST="localhost:7990" yarn --cwd packages/app/cypress/scripts --silent build-environment tpb > .envrc
	$(eval token="$(shell yarn --cwd packages/app/cypress/scripts --silent generate-bitbucket-server-token)")
	@echo "export BITBUCKET_TOKEN=$(token)" >> .envrc
	@echo "export APP_FOLDER='../..'" >> .envrc
	@echo "export TECHDOCS_FOLDER='../../examples/techdocs/output'" >> .envrc
	@echo "The environment variables have been stored in the .envrc file. Please copy the contents of the app-config.e2e.yaml into your app-config.local.yaml file if you want to make use of them."

bitbucket-token: ## # Generate a bitbucket token.
	$(eval token="$(shell yarn --cwd packages/app/cypress/scripts --silent generate-bitbucket-server-token)")
	@echo $(token)

start-bitbucket-server: stop-bitbucket-server login-to-vault # Start the bitbucket server docker container.
	$(MAKE) -C packages/app/cypress install_scripts
	VAULT_ADDR=$(VAULT_ADDR) $(MAKE) -C packages/app/cypress bitbucket

start-ldap-server: stop-ldap-server # Stop the ldap server docker container.
	VAULT_ADDR=$(VAULT_ADDR) $(MAKE) -C packages/app/cypress ldap-server

start-dependencies: start-bitbucket-server start-ldap-server ## # Start the e2e dependencies (bitbucket & ldap servers). Useful if you want to setup a dev environment like in the e2e.

stop-bitbucket-server: # Stop the bitbucket server docker container.
	$(MAKE) -C packages/app/cypress stop-bitbucket

delete-bitbucket-server: # Delete the bitbucket server docker container.
	$(MAKE) -C packages/app/cypress delete-bitbucket

stop-ldap-server: # Stop the ldap server docker container.
	$(MAKE) -C packages/app/cypress stop-ldap-server

start-tpb-server: login-to-vault # Start the tpb docker container.
	BACKSTAGE_BASE_URL=http://localhost:7007 VAULT_ADDR=$(VAULT_ADDR) $(MAKE) -C packages/app/cypress tpb

stop-tpb-server: # Stop the tpb docker container
	$(MAKE) -C packages/app/cypress stop-tpb

stop-dependencies: stop-bitbucket-server stop-ldap-server ## # Stop the e2e dependencies (bitbucket & ldap servers).
