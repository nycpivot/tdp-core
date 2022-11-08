# The Plugins Folder

This is where your own plugins and their associated modules live, each in a
separate folder of its own.

If you want to create a new plugin here, go to your project root directory, run
the command `yarn backstage-cli create`, and follow the on-screen instructions.

You can also check out existing plugins on [the plugin marketplace](https://backstage.io/plugins)!

## Build a custom ESBack plugin

An ESBack plugin is a thin wrapper for a Backstage plugin.
It exports an instance of the AppPluginInterface or BackendPluginInterface in `src/index.ts` depending on the type of plugin.
You can see a sample of a frontend ESBack plugin in `esback-hello-world`.

### Setup a local package registry: Verdaccio

Before building a plugin, we will need a place to publish it: Verdaccio.
We could publish our plugin directly to the Artifactory registry, but during development this could be dangerous especially when updating existing plugins.
Verdaccio will host whatever plugins we are developing locally.

1.  Install [verdaccio](https://verdaccio.org/)

1.  Run Verdaccio:

    ```
    verdaccio
    ```

1.  Add user/authenticate with Verdaccio. Use any username/password you want:

    ```
    npm adduser --registry http://localhost:4873/
    ```

    At this point we can build and publish our plugin to our local Verdaccio registry.
    When building our Backstage instance, we can point it to this registry to download the plugins.
    Unfortunately our local registry alone doesn't contain all the necessary plugins and packages to build Backstage.
    For this to work, we will allow Verdaccio to act as a proxy for Artifactory.

1.  Running the `verdaccio` command will create a verdaccio directory under the current path.
    Edit the Verdaccio config located under `verdaccio/config.yaml`.
    Change `uplinks.npmjs.url` to `https://artifactory.eng.vmware.com/artifactory/api/npm/esback-npm-local/`:

    ```
    uplinks:
     npmjs:
       url: https://artifactory.eng.vmware.com/artifactory/api/npm/esback-npm-local/
    ```

1.  Restart the `verdaccio` process.
    Now Verdiccio will attempt to serve packages/plugins that you've published locally.
    If the package/plugin is not found, it looks for a match on Artifactory and serves that.

### Create a frontend plugin:

1.  To keep things simple, feel free to include all of your ui code in the ESBack plugin itself.
    Later, try writing a backstage plugin, publishing it, then consuming it in an ESBack plugin.

1.  Build your ESBack plugin. From inside of your plugin directory, run:

    ```
    yarn tsc
    yarn build
    ```

    You can also run this command from the project root to build all packages.

1.  Publish your plugin to your local Verdaccio registry by going to your plugin directory and running:

    ```
    npm publish --registry http://localhost:4873/
    ```

    You can also publish all of the packages included in the repo.
    From the project root, run:

    ```
    yarn run lerna publish from-package --registry <registry>
    ```

    If you exclude the registry flag, the packages will be published to the registry specified in the `lerna.json` file at the project root.
    Production packages will be published to our [artifactory](https://artifactory.eng.vmware.com/artifactory/api/npm/esback-npm-local/).

### Build a Backstage instance with a custom ESBack plugin

Once you have a custom ESBack plugin published to a registry, follow the [Build a Backstage instance using the builder cli](https://gitlab.eng.vmware.com/esback/tools/-/blob/main/README.md#build-a-backstage-instance-using-the-builder-cli) guide above with a few extra steps:

1.  Add your plugin to your `esback-config.yml` file.

1.  If you have published your plugin somewhere other than our artifactory, update the `bootstrap/template/.yarnrc` file to point to your registry.

    At this point you can use the builder cli as described in [Build a Backstage instance using the builder cli](https://gitlab.eng.vmware.com/esback/tools/-/blob/main/README.md#build-a-backstage-instance-using-the-builder-cli).

    If you want to try this with the builder image, you will need to bake your plugin into the builder image with the following steps:

1.  Follow the [Build the Builder Image](https://gitlab.eng.vmware.com/esback/tools/-/blob/main/README.md#making-changes) section above.
    This will rebuild the custom stack, builder and buildpack with the updated `boostrap/template.yarnrc` file pointing to your registry.
    If you are using a local registry, you may run into networking issues in docker.
    You need to make your local registry available to the docker containers.

1.  Follow the steps in [Build a Backstage instance using Cloud Native Buildpacks](#build-a-backstage-instance-using-cloud-native-buildpacks).

## Publishing plugins

Plugins are published to the [`esback-npm-local` registry in VMWare's private Artifactory
instance](https://artifactory.eng.vmware.com/ui/repos/tree/General/esback-npm-local).

### Specifying credentials

- Create an `.npmrc` file in the plugin's root directory (_not_ the project root directory) with the following content:
  ```
  @esback:registry = https://artifactory.eng.vmware.com/artifactory/api/npm/esback-npm-local/
  //artifactory.eng.vmware.com/artifactory/api/npm/esback-npm-local/:_authToken=${NPM_AUTH_TOKEN}
  email = ${NPM_AUTH_EMAIL}
  ```
- Provision an auth token by logging into Artifactory:
  ```shell
  $ npm login --registry=https://artifactory.eng.vmware.com/artifactory/api/npm/esback-npm-local/
  Username: <VMWare username (without @vmware.com)>
  Password: <your SSO password>
  Email: (this IS public) <username@vmware.com>
  Logged in as <VMWare username> on https://artifactory.eng.vmware.com/artifactory/api/npm/esback-npm-local/.
  ```
- Extract the auth token from `${HOME}/.npmrc` (for whatever reason NPM does not write this to the directory-local `.npmrc`, but the global `.npmrc` instead) and export as an environment variable:
  ```shell
  $ export NPM_AUTH_TOKEN=(cat ${HOME}/.npmrc | sed 's/.*=//')
  ```
- Export your email address as an environment variable:
  ```shell
  $ export NPM_AUTH_EMAIL=<username@vmware.com>
  ```

### Publishing a new version of the package

This should almost certainly always happen via a CI job, and is the standard `npm publish` flow.

- Bump plugin version in its `package.json`.
- From the plugin directory, run `npm publish`.

That's it.

### Unpublishing old versions of the package

While [NPM](https://docs.npmjs.com/cli/v8/commands/npm-unpublish) and [Artifactory](https://www.jfrog.com/confluence/display/JFROG/Manipulating+Artifacts#ManipulatingArtifacts-DeletingaSingleItem)
_do_ both support unpublishing packages, it looks like the VMWare Artifactory instance has been configured to disallow it. Only publish when you're absolutely confident.
