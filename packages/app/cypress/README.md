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
