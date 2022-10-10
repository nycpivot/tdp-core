# Enterprise Service Backstage

This repository contains the core backstage libraries for the Enterprise Service
Backstage product. It is the result of a heavily modified backstage app
so that there is a "single" entrypoint for plugin integration.

Here are the main components of the esback library ecosystem:

- packages/core: Contains the type definitions for developing esback plugin interfaces
- packages/runtime: Objects required to run a backstage frontend
- packages/runtime-backend: Objects required to run a backstage backend
- plugins/*: Any officially supported Backstage plugin 

## Getting started

To run the most basic version of esback, simply run this repository as you would a freshly
created Backstage app:

```sh
$ yarn install
$ yarn tsc
$ yarn dev
```

This should open up a backstage instance running on port 7007/3000 (backend/frontend)
with only the [software catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview)
enabled.
