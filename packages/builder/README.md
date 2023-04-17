This package contains the portal builder that can be used to create a portal with a set of plugins.

## Getting Started

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

This parameters specifies the npm registry that will be used in the generated portal. Only two values are possible: `verdaccio` or `artifactory`.

If no value is provided, the builder will use `artifactory` by default except if the **yarnrc_config** parameter is provided.

Example:

```shell
yarn portal --env registry=verdaccio
```

- **yarnrc_config**

This parameter specifies the file that configures yarn to access the npm registry.

If not defined, the builder will either use [this configuration](./bundle/.yarnrc.verdaccio) for verdaccio or [this one](./bundle/.yarnrc.artifactory) for artifactory.

Example:

```shell
yarn portal --env yarnrc_config=/foo/bar/.yarnrc
```

If this parameter is set, the **registry** parameter will be ignored if it is provided.

## Building the portal with buildpack

In the generated portal, there will be a `buildpack` command that can be used to build an image of the portal.

Here is the syntax to run it:

```shell
cd /foo/bar/portal
image_tag=portal:1.0.0 yarn buildpack
```

Set the tag of the image in the `image_tag` environment variable.

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
