# Cloud Native Buildpacks

This folder contains the necessary files to create a custom stack, builder and buildpack
for ESBack.

The basic idea is as follows:

- The builder image of the custom stack will contain the source code of the esback `core`
- The esback buildpack will take a folder with:
  - A single `esback-config.yml` file
  - An optional app-config.yaml file
  With this it'll generate a new esback instance. This instance will be added to the runnable image
  in a layer called *server* which will be set up in the `launch.toml` config to start the
  node process by default

This is basically a POC, and there are several things hacked out to make this work:

1. The /foundation folder in the stack-builder image has mode 777, to avoid issues when
copying it to the *server* layer
2. The base image for the esback-stack was based from ubuntu bionic and glued together on
  a rush. There might be a better suited image to be the "base of the base"

## Running locally

The required images for the stack and builder have been published to the corporate
[harbor](https://harbor-repo.vmware.com/harbor/projects/3358050/repositories).
Make sure you have the following installed on your machine:

- docker
- [pack](https://buildpacks.io/docs/tools/pack/)
 
To generate a new esback instance all you need is a folder with a valid
`esback-config.yml` file and an optional `app-config.yaml` file. For example,
let's say you wanna place your config file in a folder named *example* and
you want to create an esback instance called *esback-test*, you'll do something like:

```yaml
# esback-config.yml
metadata:
  name: esback-test
  author: someone@vmware.com
  version: 0.0.1
plugins:
  app:
    - name: "@internal/plugin-esback-graphiql"
    - name: "@internal/plugin-esback-kubernetes"
  backend:
    - name: "@internal/plugin-esback-kubernetes-backend"
```

```yaml
# app-config.yaml
catalog:
  rules:
    - allow: [Component, Domain, System, API, Group, User, Resource, Location, Template]
  locations:
    - type: url
      target: https://github.com/sample-accelerators/tanzu-java-web-app/blob/main/catalog/catalog-info.yaml
kubernetes:
  serviceLocatorMethod:
    type: 'multiTenant'
  clusterLocatorMethods:
    - type: 'config'
      clusters:
        - url: <!K8S_URL> # Make sure to replace this with a valid url
          name: main-cluster
          authProvider: serviceAccount
          serviceAccountToken: <!K*S_TOKEN> # Make sure to replace this with a valid token
          skipTLSVerify: true
          skipMetricsLookup: true
```

```sh
mkdir example
cp esback-config.yml app-config.yaml example
pack build esback-test \
  --builder harbor-repo.vmware.com/esback/cnb-builder:latest \
  --pull-policy if-not-present \
  --path examples
```

You can then run your new instance with docker:

```sh
$ docker run --rm -p 7007:7007 esback-test
```

## Making changes

If you need to make changes to either the stack or builder of esback, just modify
the files locally and once you're ready run the `publish.sh` script:

```sh
$ ./cnb/publish.sh
```

This will create the *esback-stack-builder* and *esback-stack-runner* images, as
well as the esback builder based on _cnb/builder.toml_, and try to push them to harbor.
