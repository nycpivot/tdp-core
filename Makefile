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

setup-e2e-docker-env: image
	$(MAKE) -C packages/app/cypress setup-docker-env

local-e2e:
	$(MAKE) -C packages/app/cypress local-tests

docker-e2e:
	$(MAKE) -C packages/app/cypress docker-tests