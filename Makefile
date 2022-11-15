SHELL = /bin/bash
concourse_endpoint ?= "https://runway-ci-sfo.eng.vmware.com"
vault_endpoint ?= "https://runway-vault-sfo.eng.vmware.com"

build: clean install
	yarn tsc
	yarn build

image: build
	docker build -t esback:integration -f packages/backend/Dockerfile .

clean:
	yarn clean

install:
	yarn install

login-to-vault:
	vault login -address=$(vault_endpoint) -method=ldap username=$(username)

e2e-environment: image
	$(MAKE) -C packages/app/cypress setup-docker-env

local-e2e:
	$(MAKE) -C packages/app/cypress local-tests

docker-e2e: image
	$(MAKE) -C packages/app/cypress docker-tests

login-to-concourse:
	fly -t esback login -c $(concourse_endpoint) -n esback

create-pipeline:
	$(eval branch="$(shell git rev-parse --abbrev-ref HEAD)")
	fly -t esback set-pipeline -p "$(name)" -c ci/pipeline.yml -v git_branch=$(branch) -v initial_version=0.0.0

destroy-pipeline:
	fly -t esback destroy-pipeline -p "$(name)"