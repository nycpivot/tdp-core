# The Plugins Folder

This is where your own plugins and their associated modules live, each in a
separate folder of its own.

If you want to create a new plugin here, go to your project root directory, run
the command `yarn backstage-cli create`, and follow the on-screen instructions.

You can also check out existing plugins on [the plugin marketplace](https://backstage.io/plugins)!

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
