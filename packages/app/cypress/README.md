# Integration Tests

Note: the commands described here have to be executed from the root of the project.

## Requirements

You need the following tools on your machine:

- [vault](https://www.vaultproject.io/)
- [docker and docker-compose](https://www.docker.com/)

## Login to Vault

When running one of the following commands, you might be prompted to log in to Vault if you are not already authenticated or if your token has expired.

Just enter you vault password when asked for it.

## Running the app and the integration tests locally

If you want to configure your local environment to run the integration tests against it, here is what you can do:

Start the dependencies required for the tests:

```shell
make start-dependencies
```

The integration tests depend on:

- a Bitbucket server
- a Ldap server

Both are executed in docker containers after running this command.

The Bitbucket server license keys are stored in [Vault](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/e2e).

There is one key for local development environment named `bitbucket_server_license_dev` and one for the pipelines called `bitbucket_server_license`.

Setup your environment:

```shell
make setup
```

This command will generate an `.envrc` file that you can source with `direnv` or manually. This file contains all the variables that are needed to run the integration tests.

Start your local app in integration mode:

```shell
make start-integration-app
```

This will start your local app using `app-config.e2e.yaml`.

Now, you can either run all the integration tests:

```shell
make dev-e2e
```

Or run a specific test (by filename without extension):

```shell
make dev-specific-test test=hello-world-plugin
```

Or open the Cypress UI:

```shell
make open-dev-e2e
```

(this is the recommended way to update or write new integration tests)

## Deploying the app in Docker and Running the integration tests in Docker

```shell
make docker-docker-e2e
```

This command will:

- build the application docker image
- build an environment for running the integration tests
- run the integration tests in a docker container

It is very similar to what the pipeline does to run the tests.

## Deploying the app in Docker and Running the integration tests locally

To build, deploy and run the app in Docker, execute the following command:

```shell
make e2e-environment
```

It will also run the dependencies needed by the app for the tests (Bitbucket and Ldap servers).

A Bitbucket server will be available at [http://localhost:7990](http://localhost:7990).

The Ldap server will be listening at ldap://localhost:1389.

TPB will be running at [http://localhost:7007](http://localhost:7007).

### Running the integration tests locally

Once you have an environment ready, you can run all the integration tests locally:

```shell
make docker-local-e2e
```

### Running a specific test

To run a specific test, use the following command:

```shell
make docker-local-specific-test test=hello-world-plugin
```

## Secrets

Our tests require secrets that are stored in [Vault](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/list/esback/).

If one of your tests needs the usage of a new secret, you will need to configure it at **four or six** different locations!

1. The [main pipeline](../../ci/pipeline.yml)

Look for the `integration-tests` job and the `vars` section of the `test` task and add your variable here.

2. The [merge request pipeline](../../ci/mr-check.yml)

Look for the `integration-tests` job and the `vars` section of the `test` task and add your variable here. The added variable should be exactly the same as in step 1.

3. The [build environment script](./scripts/src/build-environment.ts)

- Look for the `buildEnvironment` function
- Read the secret with the help the `vault` object
- Save its value in an environment variable related to the location where it will be used: Bitbucket server, the TPB server or Cypress.

The name of the environment variable must match the name that will be used in the context you define it.

- For the Bitbucket server context, it must match an environment variable in the docker-compose configuration for the `bitbucket` service (step 5)
- For the TPB server context, it must match an environment variable in the docker-compose configuration for the `tpb` service (step 5)
- For the cypress context, it must match the environment variable that will be used in the tests

4. The [tools pipeline](https://gitlab.eng.vmware.com/esback/tools/-/blob/main/ci/pipeline.yml)

Look for the `integration-tests` job and the `params` section of the `test` task and add your variable here.

5. Eventually the [docker compose configuration file](./docker-compose.yaml) if this secret is needed by the server

Add a new environment variable to the service that needs it. The value of this environment variable is another variable that will be set in the next step.

6. If you did the previous step, you will also need to update the [pipeline integration script file](../../ci/integration-tests.yml)

- Look for the `params` section
- Add the variable: its name must match the value you define in the previous step and its value must match the name of the secret that has been defined in the pipeline.

### A full example

Let's go through an example to see all these steps in action. Let say that we want to add a new property in our `app-config.yaml` file that requires a token from some third party.

Here is how our `app-config.yaml` file would look like:

```yaml
# ...
foo:
  bar: ${FOO_TOKEN}
# ...
```

0. In Vault, I create a secret with the value of the token. The name of this secret is `e2e.foo_token`

1. Main pipeline

I add a new entry in the `integration-tests` job `vars` section:

```yaml
  - name: integration-tests
        # ...
      - task: test
        # ...
        vars:
          # ...
          foo_token: ((e2e.foo_token))
          # ...
```

2. I do exactly the same in the merge request pipeline:

```yaml
  - name: integration-tests
        # ...
      - task: test
        # ...
        vars:
          # ...
          foo_token: ((e2e.foo_token))
          # ...
```

3. In the build environment script, I add the environment variable that will store the secret.

In that case, this variable will be used in the `tpb` context:

```typescript
case ServerType.tpb:
  return {
    // ...
    FOO_TOKEN: await vault.readE2ESecret('foo_token'),
    // ...
  }
```

Note that the name matches the variable name in the `app_config.yaml` file.

4. I update the tools pipeline:

```yaml
  - name: integration-tests
        # ...
      - task: test
        # ...
        params:
          # ...
          FOO_TOKEN: ((e2e.foo_token))
          # ...
```

Note that here, we are also naming the param with the name that is used in the `app_config.yaml` file.

5. I update the docker compose configuration file:

```yaml
tpb:
  # ...
  environment:
    # ...
    - FOO_TOKEN = ${FOO_TOKEN}
```

This `${FOO_TOKEN}` value will be defined in the next step.

6. I update the pipeline integration tests configuration:

```yaml
params:
  FOO_TOKEN: ((foo_token))
```

This is here that we do the mapping between the pipeline secret name (step 1) and the environment variable defined in step 5.

There is a [JIRA ticket](https://jira.eng.vmware.com/browse/ESBACK-214) that hopefully would simplify this heavy process once implemented.

## GKE Cluster

In order to test the kubernetes integration, we are using [a dedicated GKE cluster](https://console.cloud.google.com/kubernetes/clusters/details/us-central1-a/esback-gke-01/details?hl=fr&project=tap-activation-program). TAP has been
installed on this cluster thanks to [the multi-cloud-testing project](https://gitlab.eng.vmware.com/project-star/multi-cloud-testing).

The credentials used to connect to this cluster can be found [in the vault](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/gke). The service account used to connect to the cluster is `tap-gui`
that is available in the `tap-gui` namespace.

## Authentication to Auth0 in the tests

In order to test Auth0 login, an Auth0 account has been created using Google SSO with the account `svc.tpb@vmware.com`.
The account credentials for this Google account and the service account are in [Vault (esback/e2e)](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/e2e).
The auth config credentials are in [Vault (esback/auth0)](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/auth0)

A refresh token is used and stored in a cookie to emulate an authentication. The Auth0 account has been configured so that
this token should not expire.

## Authentication to Bitbucket in the tests

The Bitbucket account associated with this token was created using the service account `svc.tpb@vmware.com`.
The account credentials for this service account are in [Vault (esback/e2e)](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/e2e).
The auth config credentials for the BitBucket account are in [Vault (esback/bitbucket)](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/bitbucket)

In order to test Bitbucket authentication, a refresh token is used and stored in a cookie. Bitbucket refresh tokens do
not expire, hence it should not be needed to update it in the future.

## Authentication to Google in the tests

In order to test k8s rbac features, a GCP account was created using the service account `svc.tpb@vmware.com`.
The Google account credentials and service account credentials can be found in [Vault (esback/e2e)](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/e2e).
The auth config credentials for the Google account are in [Vault (esback/gke_oidc)](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/gke_oidc)

This service account is listed as catalog admin under `permission.adminRefs` in `app-config.e2e.yaml` to be able to access the catalog entities.

To emulate a Google authentication for this user, you can use the `Authentication.googleSvcTpbLogin()` function that will set up an appropriate cookie in the browser.

## Authentication to Permission Test in the tests

In order to test permission plugin, the same auth credentials for Google is used for the `Permission Test` login method, but the user identity is rotated among 4 different users. More about this test setup can be found [here](https://gitlab.eng.vmware.com/esback/fixtures/permission-plugin-integration-test).

Admin list is configured under `permission.adminRefs` in `app-config.e2e.yaml`.

To emulate a Permission Test authentication, you can use the `Authentication.permissionTestLogin()` function that will set up an appropriate cookie in the browser.

## Authentication to Okta in the tests

An Okta account was created using the service account `svc.tpb@vmware.com`.
The Okta account credentials and service account credentials are stored in [Vault (esback/e2e)](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/e2e).
The auth config credentials for the Okta account are in [Vault (esback/okta)](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/show/esback/okta)

To emulate an Okta authentication, a refresh token representing a test user is used.

## Authentication as Catalog Admin User

With permission plugin enabled, only admin users would have full access on catalog entities.
For tests that needs to access catalog but doesn't want to worry about setting up permissions, use the `Authentication.logInAsCatalogAdmin()` function.
This method triggers Github Login under the hood at the moment, and the github user has been added to the admin list (`permission.adminRefs` in `app-config.e2e.yaml`).
