# Integration Tests

## Requirements

You need the following tools on your machine:

- [vault](https://www.vaultproject.io/)
- [jq](https://stedolan.github.io/jq/)
- [docker and docker-compose](https://www.docker.com/)

## Login to Vault

Before running any command, you need to be logged in to vault. This can be done with the command:

```shell
make username=[PUT YOUR USERNAME HERE] login-to-vault
```

You will then be prompted for your password.

## Running the integration tests in a docker container

```shell
make docker-e2e
```

It should build the application and its Docker image and then run the integration tests in a docker container as close as the pipeline would do.

## Setup a local environment

This command will start a Bitbucket server, run ESBack and make it accessible on [http://localhost:7007](http://localhost:7007)

```shell
make e2e-docker-environment
```

## Running the integration tests locally

To run the integration tests locally (not having them running in a docker container), you need to have a running instance of ESBack on [http://localhost:7007](http://localhost:7007).

You can do it as described in the Setup a local environment section or manually if you're developing on it.

Then, you should be able to execute the tests with the command:

```shell
make local-e2e
```
