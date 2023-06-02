This package contains the portal builder that can be used to create a portal with a set of plugins.

## Getting Started

### Creating a minimalist portal

To create a basic portal with no added plugin, just run the following command:

```shell
yarn portal --env output_folder=/foo/bar/portal
```

It will create a folder at the location specified by the `output_folder` property. This folder
will contain the files composing the portal.

You can go to this directory, install the dependencies and run the portal:

```shell
cd /foo/bar/portal
yarn
yarn dev
```

A minimal version of the portal will be running.

### Creating a portal with some plugins

Let's say that we would like to build a portal containing some plugins:

- `@tpb/plugin-hello-world` and `@tpb/plugin-gitlab-loblaw` that are frontend plugins
- `@tpb/plugin-hello-world-backend` and `@tpb/plugin-gitlab-backend` that are a backend plugins

Let's create a file named `tpb-config.yaml` and store it somewhere. The contents of this file are:

```yaml
app:
  plugins:
    - name: '@tpb/plugin-hello-world'
    - name: '@tpb/plugin-gitlab-loblaw'
      version: '^0.0.21'
backend:
  plugins:
    - name: '@tpb/plugin-hello-world-backend'
    - name: '@tpb/plugin-gitlab-backend'
```

Now, let's create a backstage configuration file called `app-config.yaml`:

```yaml
app:
  title: My Hello World Portal
  baseUrl: http://localhost:3000

organization:
  name: VMware

backend:
  baseUrl: http://localhost:7007
  listen:
    port: 7007
  csp:
    connect-src: ["'self'", 'http:', 'https:']
    upgrade-insecure-requests: false
  cors:
    origin: http://localhost:3000
    methods: [GET, POST, PUT, DELETE]
    credentials: true
  database:
    client: better-sqlite3
    connection: ':memory:'
  cache:
    store: memory
  auth:
    keys:
      - secret: ${BACKEND_SECRET}

integrations:
  gitlab:
    - host: gitlab.eng.vmware.com
      baseUrl: https://gitlab.eng.vmware.com
      apiBaseUrl: https://gitlab.eng.vmware.com/api/v4/
      token: ${GITLAB_TOKEN}

auth:
  allowGuestAccess: true
  providers: {}

techdocs:
  builder: 'local'
  generator:
    runIn: 'docker'
  publisher:
    type: 'local'

catalog:
  providers:
    gitlab:
      tpb:
        host: gitlab.eng.vmware.com
        group: esback/fixtures
        entityFilename: catalog-info.yaml
        schedule:
          frequency: { minutes: 1 }
          timeout: { minutes: 3 }
  rules:
    - allow: [Component, System, API, Resource, Location]
```

We will also need a Gitlab token to be stored in an environment variable called `GITLAB_TOKEN`.

Let's build the portal now:

```shell
yarn portal --env output_folder=/foo/portal --env tpb_config=/bar/tpb-config.yaml --env app_config=/bar/app-config.yaml
```

Let's try to run it:

```shell
cd /foo/portal
yarn
yarn dev
```

The portal should be running at [http://localhost:3000](http://localhost:3000)

After playing with it, stop the portal and let's generate a Docker image of it:

```shell
image_tag=hello_portal:1.0.0 yarn buildpack
```

It will probably take a while, specially the first time you run this command since it has to download a bunch of Docker layers and build everything.

and run it in a container:

```shell
docker run --rm -p 7007:7007 --env GITLAB_TOKEN=<your token> hello_portal:1.0.0
```

The portal should be running at [http://localhost:7007](http://localhost:7007)

## Configuration

To specify an argument, use the `--env` flag followed by the argument name and value.

The `yarn portal` command accepts the following arguments:

- **output_folder**

This parameter specifies the name of the folder where the portal will be created.

If not provided, the portal will be generated in a folder called `portal` in the current directory.

Example:

```shell
yarn portal --env output_folder=/foo/bar/portal
```

- **app_config**

This parameter specifies the location of the backstage configuration file to use.

If not provided, it will use [conf/app-config.yaml](./conf/app-config.yaml)

Example:

```shell
yarn portal --env app_config=/foo/bar/app-config.yml
```

- **tpb_config**

This parameter specifies the location of the file containing the list of plugins to install.

If not provided, the portal will contain a minimal list of plugins and no additional plugin will be installed.

Example:

```shell
yarn portal --env tpb_config=/foo/bar/tpb-config.yaml
```

This file must be a yaml file following this structure:

```yaml
app:
  plugins:
    - name: 'app-plugin1'
      version: 'app-plugin1-version'
    - name: 'app-plugin2'
      version: 'app-plugin2-version'
backend:
  plugins:
    - name: 'backend-plugin1'
      version: 'backend-plugin1-version'
    - name: 'backend-plugin2'
      version: 'backend-plugin2-version'
```

The `app` section contains the frontend plugins that need to be installed while the `backend` section contains those that need to be installed on the backend side.

The `version` property is optional: when not provided, the builder will look for the last version available in the registry that is configured (see below).

An example of this file can be found [here](./conf/tpb-config.yaml).

- **registry**

This parameter specifies the npm registry that will be used in the generated portal. Only two values are possible: `verdaccio` or `artifactory`.

If no value is provided, the builder will use `artifactory` by default except if the **yarnrc_config** parameter is provided.

Example:

```shell
yarn portal --env registry=verdaccio
```

- **yarnrc_config**

This parameter specifies the file that configures yarn to access the npm registry.

If not defined, the builder will either use [this configuration](./bundle/.yarnrc.verdaccio) for verdaccio or [this one](./bundle/.yarnrc.artifactory) for artifactory depending on the value of the **registry** parameter.

Example:

```shell
yarn portal --env yarnrc_config=/foo/bar/.yarnrc
```

If this parameter is set, the **registry** parameter will be ignored if it is provided.

## Developing a plugin locally

It is possible to create a portal that can be used for local plugin development.

Suppose that you are working on a new frontend plugin that has its own repository. Let's call it `fancy-plugin` and let's suppose that its source code is stored in the `/foo/fancy-plugin` folder.

To generate a portal referencing your plugin, create the following `tpb-config.yaml` file somewhere (for our example, il will be in the `bar` folder):

```yaml
apps:
  plugins:
    - name: fancy-plugin
      version: 'link:/foo/fancy-plugin'
```

Then, run the following command:

```shell
yarn portal --env output_folder=/foo/portal --env tpb_config=/bar/tpb-config.yaml
```

And that's it.

After running `yarn` and `yarn dev` in the portal folder, you will be able to modify your plugin code and refresh the browser to see your changes applied.

The same technique can be used for backend plugins too.
