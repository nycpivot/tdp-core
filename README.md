# Enterprise Service Backstage

This repository contains the core backstage app for the Enterprise Service
Backstage product. It is the result of a heavily modified backstage app
so that there is a "single" entrypoint for plugin integration.

This package also contains a couple of examples for esback plugins, 
basically backstage plugins that know how to add themselves to an
esback instance.

## Getting started

To run the most basic version of esback, simply clone this repository and
run the next commands from the root folder:

```sh
$ yarn install
$ yarn tsc
$ yarn dev
```

This should open up a backstage instance running on port 7007/3000 (backend/frontend)
with only the [software catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview)
enabled.

### Adding plugins

You can use the bootstrap tool included in the *cli* folder to add available
plugins to the current instance of esback. For example, to bootstrap an esback
instance with the kubernetes plugin, create an esback config like this:

```yaml
# esback-config.yml
metadata:
  name: esback-test
  author: dbravo@vmware.com
  version: 0.0.1
plugins:
  app:
    - name: "@internal/plugin-esback-kubernetes"
  backend:
    - name: "@internal/plugin-esback-kubernetes-backend"
```

And then run the bootstrap tool with `./cli/bootstrap -f esback-config.yml`.

This will modify the current `packages/app/src/core/index.tsx` and `packages/backend/src/index.ts`
files to add the configured plugins. Make sure not to add this changes to version control
or they will become default in esback.

You can find an example of an esback instance with all currently available plugins under
*examples/esback-config.yml*.
