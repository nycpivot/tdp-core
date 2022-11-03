SHELL := /bin/bash

login-to-vault:
	vault login -address=https://runway-vault-sfo.eng.vmware.com -method=ldap username=$(username)

docker-tests:
	./scripts/run-tests-in-docker.sh

setup-local-env:
	BACKSTAGE_BASE_URL=http://localhost:7007 ./scripts/setup-local-env.sh

local-tests:
	CYPRESS_baseUrl=http://localhost:7007 ./scripts/run-tests.sh
