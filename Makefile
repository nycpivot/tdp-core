SHELL = /bin/bash
username ?= $(shell whoami)
concourse_endpoint ?= "https://runway-ci-sfo.eng.vmware.com"
vault_endpoint ?= "https://runway-vault-sfo.eng.vmware.com"

check_vault:
ifndef VAULT_ADDR
	$(error Please define VAULT_ADDR in your environment)
endif

build: clean install
	yarn tsc
	yarn build

image: build
	docker build -t esback:integration -f packages/backend/Dockerfile .

clean:
	yarn clean

install:
	yarn install

login-to-vault: check_vault
	@echo "Login as $(username)"
	vault login -address=${VAULT_ADDR} -method=ldap username=$(username)

e2e-environment: export BACKSTAGE_BASE_URL=http://localhost:7007
e2e-environment: check_vault image
	$(MAKE) -C packages/app/cypress start-containers

local-e2e: export BITBUCKET_HOST = localhost:7990
local-e2e:
	$(MAKE) -C packages/app/cypress local-tests

docker-e2e: export BACKSTAGE_BASE_URL=http://esback:7007
docker-e2e: check_vault image
	$(MAKE) -C packages/app/cypress docker-tests

login-to-concourse:
	fly -t esback login -c $(concourse_endpoint) -n esback

create-pipeline:
	$(eval branch="$(shell git rev-parse --abbrev-ref HEAD)")
	fly -t esback set-pipeline -p "$(name)" -c ci/pipeline.yml -v git_branch=$(branch) -v initial_version=0.0.0

destroy-pipeline:
	fly -t esback destroy-pipeline -p "$(name)"