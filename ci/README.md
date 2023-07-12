# Modifying pipelines

## Setup

- Install ytt
  ```
  curl -L https://carvel.dev/install.sh | K14SIO_INSTALL_BIN_DIR=~/.local/bin/ bash
  ```

## Testing changes on the main branch

You can test changes to pipelines by running `make create-pipeline` from the root of the project to create a test
pipeline with a name matching your branch name.

## Testing changes on a release branch

Using the commands for the `make create-pipeline` task, modify the input file argument to `ytt` to use the values for
your release branch. For example if you are working on release 1.6, change the command to

```
ytt -f ci/pipeline.yml -f ci/values/release-1.6.x/values.yaml > ci/rendered-pipeline.yml
```
