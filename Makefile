SHELL = /bin/bash
username ?= $(shell whoami)
concourse_endpoint ?= "https://runway-ci-sfo.eng.vmware.com"
VAULT_ADDR ?= "https://runway-vault-sfo.eng.vmware.com"
CYPRESS_baseUrl ?= "http://localhost:3000"

build: clean install compile
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

local-e2e: login-to-vault
	VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=$(CYPRESS_baseUrl) $(MAKE) -C packages/app/cypress local-tests

open-cypress: login-to-vault
	VAULT_ADDR=$(VAULT_ADDR) CYPRESS_baseUrl=$(CYPRESS_baseUrl) $(MAKE) -C packages/app/cypress open-cypress-local

docker-e2e: image login-to-vault
	VAULT_ADDR=$(VAULT_ADDR) $(MAKE) -C packages/app/cypress docker-tests

create-pipeline:
	$(eval branch="$(shell git rev-parse --abbrev-ref HEAD)")
	fly -t esback set-pipeline -p "$(name)" -c ci/pipeline.yml -v git_branch=$(branch) -v initial_version=0.0.0
	fly -t esback unpause-pipeline -p "$(name)"

destroy-pipeline:
	fly -t esback destroy-pipeline -p "$(name)"
