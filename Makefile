SHELL = /bin/bash

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
	vault login -address=https://runway-vault-sfo.eng.vmware.com -method=ldap username=$(username)

e2e-docker-environment: image
	$(MAKE) -C packages/app/cypress setup-docker-env

local-e2e:
	$(MAKE) -C packages/app/cypress local-tests

docker-e2e: image
	$(MAKE) -C packages/app/cypress docker-tests

login-to-concourse:
	fly -t esback login -c https://runway-ci-sfo.eng.vmware.com -n esback

create-pipeline:
	$(eval branch="$(shell git rev-parse --abbrev-ref HEAD)")
	fly -t esback set-pipeline -p "$(name)" -c ci/pipeline.yml -v git_branch=$(branch) -v initial_version=0.0.0

destroy-pipeline:
	fly -t esback destroy-pipeline -p "$(name)"