SHELL = /bin/bash
username ?= $(shell whoami)
concourse_endpoint ?= "https://runway-ci-sfo.eng.vmware.com"
VAULT_ADDR ?= "https://runway-vault-sfo.eng.vmware.com"
CYPRESS_baseUrl ?= "http://localhost:3000"

build: clean install compile lint check-prettier
	yarn build

compile:
	yarn tsc

image: build
	docker build -t esback:integration -f packages/backend/Dockerfile .

clean:
	yarn clean

install:
	yarn install

lint:
	yarn lint:all

fix-lint:
	yarn lint:all --fix

check-prettier:
	yarn prettier:check

prettier:
	yarn prettier --write .

test:
	yarn test:all

start: install
	yarn dev

login-to-vault:
ifeq (, $(findstring expire_time, $(shell vault token lookup -address ${VAULT_ADDR} 2>/dev/null | grep expire_time)))
	@echo "Let's connect to Vault"
	@vault login -address=${VAULT_ADDR} -method=ldap username=$(username)
else
	@echo "Already logged in to vault"
endif

e2e-environment: export BACKSTAGE_BASE_URL=http://localhost:7007
e2e-environment: image login-to-vault
	VAULT_ADDR=$(VAULT_ADDR) $(MAKE) -C packages/app/cypress start-containers

docker-docker-e2e: image login-to-vault
	VAULT_ADDR=$(VAULT_ADDR) $(MAKE) -C packages/app/cypress docker-tests

docker-local-e2e: login-to-vault
	BITBUCKET_CATALOG_PREFIX="bitbucket:7990" VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=http://localhost:7007 $(MAKE) -C packages/app/cypress local-tests

dev-e2e: login-to-vault
	BITBUCKET_CATALOG_PREFIX="localhost:7990" VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=http://localhost:3000 $(MAKE) -C packages/app/cypress local-tests

docker-local-specific-test: login-to-vault
	BITBUCKET_CATALOG_PREFIX="bitbucket:7990" VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=http://localhost:7007 $(MAKE) -C packages/app/cypress specific-test test=$(test)

dev-specific-test: login-to-vault
	BITBUCKET_CATALOG_PREFIX="localhost:7990" VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=http://localhost:3000 $(MAKE) -C packages/app/cypress specific-test test=$(test)

open-docker-local-e2e: login-to-vault
	BITBUCKET_CATALOG_PREFIX="bitbucket:7990" VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=http://localhost:7007 $(MAKE) -C packages/app/cypress open-cypress-local

open-dev-e2e: login-to-vault
	BITBUCKET_CATALOG_PREFIX="localhost:7990" VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=http://localhost:3000 $(MAKE) -C packages/app/cypress open-cypress-local

create-pipeline:
	$(eval branch="$(shell git rev-parse --abbrev-ref HEAD)")
	fly -t esback set-pipeline -p "$(name)" -c ci/pipeline.yml -v git_branch=$(branch) -v initial_version=0.0.0
	fly -t esback unpause-pipeline -p "$(name)"

destroy-pipeline:
	fly -t esback destroy-pipeline -p "$(name)"

setup: login-to-vault
	VAULT_ADDR=$(VAULT_ADDR) LDAP_ENDPOINT="ldap://localhost:1389" BITBUCKET_HOST="localhost:7990" yarn --cwd packages/app/cypress/scripts --silent build-environment esback > .envrc
	$(eval token="$(shell yarn --cwd packages/app/cypress/scripts --silent generate-bitbucket-server-token)")
	@echo "export BITBUCKET_TOKEN=$(token)" >> .envrc
	@echo "export APP_FOLDER='../..'" >> .envrc
	@echo "export TECHDOCS_FOLDER='../../examples/techdocs/output'" >> .envrc
	@echo "The environment variables have been stored in the .envrc file. Please copy the contents of the app-config.e2e.yaml into your app-config.local.yaml file if you want to make use of them."

bitbucket-token:
	$(eval token="$(shell yarn --cwd packages/app/cypress/scripts --silent generate-bitbucket-server-token)")
	@echo $(token)

start-bitbucket-server: stop-bitbucket-server
	VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=$(CYPRESS_baseUrl) $(MAKE) -C packages/app/cypress bitbucket

start-ldap-server: stop-ldap-server
	VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=$(CYPRESS_baseUrl) $(MAKE) -C packages/app/cypress ldap-server

start-dependencies: start-bitbucket-server start-ldap-server

stop-bitbucket-server:
	VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=$(CYPRESS_baseUrl) $(MAKE) -C packages/app/cypress stop-bitbucket

delete-bitbucket-server:
	VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=$(CYPRESS_baseUrl) $(MAKE) -C packages/app/cypress delete-bitbucket

stop-ldap-server:
	VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=$(CYPRESS_baseUrl) $(MAKE) -C packages/app/cypress stop-ldap-server

stop-dependencies: stop-bitbucket-server stop-ldap-server
