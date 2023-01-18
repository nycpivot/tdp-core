# Integration Tests

Note: the commands described here have to be executed from the root of the project.

## Requirements

You need the following tools on your machine:

- [vault](https://www.vaultproject.io/)
- [jq](https://stedolan.github.io/jq/)
- [docker and docker-compose](https://www.docker.com/)

## Login to Vault

Before running any command, you need to be logged in to vault. This can be done with the command:

```shell
make login-to-vault
```

You will then be prompted for your password.

By default, the command will use your current shell's user to connect to vault. If you need to specify another user, use the following command instead:

```shell
make login-to-vault username=[PUT YOUR USERNAME HERE]
```

## Running the integration tests in a docker container

```shell
make docker-e2e
```

This command will:

- build the application docker image
- build an environment for running the integration tests
- run the integration tests in a docker container

It is very similar to what the pipeline does to run the tests.

## Setup a local environment

It is possible to build an environment that is identical to the one used by the integration tests in the pipeline.

```shell
make e2e-environment
```

A Bitbucket server will be available at [http://localhost:7990](http://localhost:7990).

ESBack will be available at [http://localhost:7007](http://localhost:7007).

## Running the integration tests locally

Once you have an environment ready, you can run the integration tests locally:

```shell
make local-e2e
```

## GKE Cluster

In order to test the kubernetes integration, we are using [a dedicated GKE cluster](https://console.cloud.google.com/kubernetes/clusters/details/us-central1-a/esback-gke-01/details?hl=fr&project=tap-activation-program). TAP has been
installed on this cluster thanks to [the multi-cloud-testing project](https://gitlab.eng.vmware.com/project-star/multi-cloud-testing).

The credentials used to connect to this cluster can be found [in the vault](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/gke). The service account used to connect to the cluster is `tap-gui`
that is available in the `tap-gui` namespace.

## Authentication to Auth0 in the tests

In order to test Auth0 login, an Auth0 account has been created with the user `esback.e2e@gmail.com` account. The credentials
for this user can be found in [Vault](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/e2e) under
the `john_doe_password` key.

A refresh token is used and stored in a cookie to emulate an authentication. The Auth0 account has been configured so that
this token should not expire.

## Authentication to Bitbucket in the tests

In order to test Bitbucket authentication, a refresh token is used and stored in a cookie. Bitbucket refresh tokens do
not expire, hence it should not be needed to update it in the future.

The Bitbucket user associated with this token is named John Doe. Its google email & google password can be found in [Vault](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/e2e) and its credentials can be used to connect to its Bitbucket account
using Google SSO.

## Authentication to Google in the tests

In order to test k8s rbac features, an external Google user has been created. Its email address is `esback.e2e.usera@gmail.com` and its password can be found in [Vault](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/e2e).

To emulate a google authentication for this user, you can use the `Authentication.googleUserALogin()` function that will setup an appropriate cookie in the browser.

## Authentication to Okta in the tests

A dev tenant Okta has been created for the tests. The information about it can be found in
[Vault](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/okta).

To emulate an Okta authentication, a refresh token representing a test user is used.