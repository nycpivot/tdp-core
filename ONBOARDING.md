# Onboarding

This document describes resources to get you familiar with working and building the ESBack project. It is meant to evolve along with the project. If you find any outdate information, or something you found useful during your onboarding that is not included here, please feel free to update the doc.

## Relevant Reading

[Backstage Enterprise Support Strategy Review](https://docs.google.com/document/d/1QxMhHVxsPnMXBCJQgE9_U0oXKjzyScLqm7B1lyEP8qw/edit) - Start here. It’s a high-level overview of the business objectives

[Taxonomy of core ESBack terminology](https://docs.google.com/document/d/1x8_1eq8yyBzwq4r_twzPzI3pdDPrqWkh3c1xs9Ya8Uc/edit)

[Enterprise Supported Backstage Architecture Review](https://docs.google.com/document/d/1jBpTVpg8ABavhVUzDKTri-LbdNE4pLpxQRtljMEDC84/edit) - High-level review of the project architecture

[Miro board with detailed architecture](https://miro.com/app/board/uXjVOpj4AGc=/?moveToWidget=3458764533901823314&cot=14)

[Delivery plan](https://docs.google.com/presentation/d/1mBADhpKO4zCcegbfLJRIoes-763eF80cCyDzYWI_DaA/edit#slide=id.p1) - Sequence of the high-level work items we’ll be tackling, with milestone definitions and commentary on staffing.

[Enterprise Supported Backstage Confluence page](https://confluence.eng.vmware.com/display/CNA/Enterprise+Supported+Backstage)

## Architecture Diagram

For more detailed architecture diagrams check our [Miro board](https://miro.com/app/board/uXjVOpj4AGc=/?moveToWidget=3458764533901823314&cot=14).
![ESBack Architecture Diagram](architecture-diagram.jpg)

## Relevant tools and access

Confirm you have access to the following tools:

- [The Gitlab esback group](https://gitlab.eng.vmware.com/esback), and all the projects contained within (Builder, Core, Decisions, Foundation, Plugins, and Tools)
- [Our Runway pipeline](https://runway-ci-sfo.eng.vmware.com/)
- [Our Runway vault instance](https://runway-vault-sfo.eng.vmware.com/ui/vault/secrets/runway_concourse/list/esback/)
- [Esback project in Harbor](https://harbor-repo.vmware.com/harbor/projects/3358050/repositories)
- [Artifactory](https://artifactory.eng.vmware.com/ui/repos/tree/General/esback-npm-local) - it is public to view, but you will need permissions to push to it

## Things to Try

### Prerequisites: Backstage

Get familiar with [Backstage](https://backstage.io/). One of the main pain points ESBack attempts to resolve is the manual process of adding plugins to Backstage. To feel some of this pain consider going through the Backstage [Plugin Development Guide](https://backstage.io/docs/plugins/plugin-development) and the [Adding Custom Plugin to Existing Monorepo App](https://backstage.io/docs/tutorials/quickstart-app-plugin) tutorial.

### Build a Backstage instance using the builder cli

The builder cli is a tool for producing custom templated instances of Backstage. It can be found in our [tools repo](https://gitlab.eng.vmware.com/esback/tools/-/tree/main/), in the [bootstrap directory](https://gitlab.eng.vmware.com/esback/tools/-/tree/main/bootstrap).

You can create a custom instance of Backstage by running the following command from inside of the bootstrap directory:

```
go run . -f <path to>/esback-config.yml -t demo
```

where:

`-f` is your esback config file. There is a sample esback config file under `examples/esback-config.yml`

`-t` is the directory where your custom Backstage instance will be generated. If the dir does not exist, it will be created. You can also provide an optional `app-config.yaml` file by placing it inside of your `-t` directory.

> **Note:** The `examples/esback-config.yml` file serves two purposes. It is a sample config file, and it is used in the build process for the builder image to specify the packages that are baked into the image and stored in the offline-cache. You can see this in the offline-cache section of the [Dockerfile](https://gitlab.eng.vmware.com/esback/tools/-/blob/main/Dockerfile). More on the builder image build process later.

> **Note:** You can also run the go command from the project root:
>
> 1.  Add a `go.work` file at the project root with the following content:
>
>     ```
>     go 1.18
>
>     use ./bootstrap
>     ```
>
> 1.  Now you can run the builder from the project root:
>
>     ```
>     go run ./bootstrap -f esback-config.yml -t demo
>     ```

> **Note:** The builder cli is configured to pull esback packages from our artifactory by default. This is configured in the `bootstrap/template/.yarnrc` file. Update this file before running the cli if you want to pull from another registry.

Your demo directory should now contain a custom instance of Backstage. To start your server, run the following from inside of the demo directory:

```
yarn install
yarn tsc
yarn dev
```

### Build a Backstage instance using Cloud Native Buildpacks

The builder image is an OCI image containing the builder cli and dependencies. The image contains everything that we provide for building a custom instance of Backstage, including plugins that we officially support. This is how customers will consume ESBack. For a detailed diagram refer to our [Miro board](https://miro.com/app/board/uXjVOpj4AGc=/).

We use a custom [Cloud Native Buildpack](https://buildpacks.io/) defined in the buildpacks directory to build and output a runnable OCI image containing your custom instance of Backstage.

The docker file for the builder image can be found in [here](https://gitlab.eng.vmware.com/esback/tools/-/blob/main/Dockerfile).

The flow is described in the tools repo [README](https://gitlab.eng.vmware.com/esback/tools/-/blob/main/README.md).

In short,

1. Create a directory with your `esback-config.yml` file, along with an optional `app-config.yml`
2. Build your Backstage instance image:

   ```
   pack build esback-test \
   --builder harbor-repo.vmware.com/esback/cnb-builder:0.0.1-alpha.1 \
   --pull-policy if-not-present \
   --path example
   ```

3. Run the image:

   ```
   docker run --rm -p 7007:7007 esback-test
   ```

### Build the Builder Image

Follow the steps in the tools repo README under the [Making Changes](https://gitlab.eng.vmware.com/esback/tools/-/blob/main/README.md#making-changes) section.

### Build a custom ESBack plugin

An ESBack plugin is a thin wrapper for a Backstage plugin. It exports an instance of the AppPluginInterface or BackendPluginInterface in `src/index.ts` depending on the type of plugin. You can see a sample of a frontend ESBack plugin in `plugins/esback-hello-world`.

Try the following steps to create a frontend plugin:

1. To keep things simple, feel free to include all of your ui code in the ESBack plugin itself. Later, try writing a backstage plugin, publishing it, then consuming it in an ESBack plugin.

1. Build your ESBack plugin. From inside of your plugin directory, run:

   ```
   yarn build
   ```

   You can also run this command from the project root to build all packages.

1. Publish your ESBack plugin. You can publish your ESBack plugin as an npm package to any registry of your choosing. To publish, run:

   ```
   npm publish --registry <registry>
   ```

   You can also publish all of the packages included in the repo. From the project root, run:

   ```
   yarn run lerna publish from-package --registry <registry>
   ```

   If you exclude the registry flag, the packages will be published to the registry specified in the `lerna.json` file at the project root. Production packages will be published to our [artifactory](https://artifactory.eng.vmware.com/artifactory/api/npm/esback-npm-local/). For local development, you can use a personal registry, or a local registry like [verdaccio](https://verdaccio.org/).

### Build a Backstage instance with a custom ESBack plugin

Once you have a custom ESBack plugin published to a registry, follow the [Build a Backstage instance using the builder cli](#build-a-backstage-instance-using-the-builder-cli) guide above with a few extra steps:

1. Add your plugin to your `esback-config.yml` file.

1. If you have published your plugin somewhere other than our artifactory, update the `bootstrap/template/.yarnrc` file to point to your registry.

At this point you can use the builder cli as described in [Build a Backstage instance using the builder cli](link).

If you want to try this with the builder image, you will need to bake your plugin into the builder image with the following steps:

1. Follow the [Build the Builder Image](#build-the-builder-image) section above. This will rebuild the custom stack, builder and buildpack with the updated `boostrap/template.yarnrc` file pointing to your registry. If you are using a local registry, you may run into networking issues in docker. You need to make your local registry available to the docker containers.

2. Follow the steps in [Build a Backstage instance using Cloud Native Buildpacks](#build-a-backstage-instance-using-cloud-native-buildpacks).
