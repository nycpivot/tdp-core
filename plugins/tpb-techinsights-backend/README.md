# Tanzu Portarl Builder (TPB) - TechInsights BackEnd Wrapper

## Introduction and OOTB features

This code is a thin-wrapper for the [TechInsights BackEnd plugin](https://github.com/backstage/backstage/tree/master/plugins/tech-insights-backend) that, by default, includes a scorecard that showcases the results of the following 3 fact checkers [already provided](https://github.com/backstage/backstage/tree/master/plugins/tech-insights-backend#included-factretrievers) by TechInsights:

- entityOwnershipFactRetriever
- entityMetadataFactRetriever
- techdocsFactRetriever

Used in conjunction with the [FrontEnd wrapper](../tpb-techinsights/) it brings TechInsight's default functionalities into TPB.

## Plugin Wrapper Overview

This wrapper uses the concept of [Surfaces](../../README.md#backend-plugins) to incorporate the TechInsights backend plugin into TPB.

What follows is a technical explanation of how this wrapping is done using the Surfaces APIs.

### Plugin Boilerplate

Let's create our plugin folder structure by making a copy of the [tpb-hello-world-backend plugin](../tpb-hello-world-backend/) and modifying its contents.
Dont' forget to modify the `package.json` file to reflect the name and version of your wrapper. For this example we've used `@tpb/plugin-techinsights-backend` to keep the pattern used by other plugins.

### Defining a `BackendPluginInterface`

In order for TPB to pick up the plugin we need to create a definition of type `BackendPluginInterface` which is defined by the `@tpb/core-backend` package. This package should already be included in your dependencies if you created the boilerplate following the instructions above.

This definition is a high-order-function that returns a function that takes in as parameter the `SurfaceStoreInterface`; this `SurfaceStoreInterface` will be then used to _apply_ the dependencies to the specified surfaces.

A barebones definition of a backend plugin may look like the following:

```
export const BackendPlugin: BackendPluginInterface =
  () => (context: SurfaceStoreInterface) =>
    context.applyTo(SurfaceToUse, surfaceToUse => {
      surfaceToUse.addPlugin({
        name: 'plugin-name',
        pluginFn: (environment: PluginEnvironment) => Promise<Router>,
      });
    });
```

where `context` is of type `SurfaceStoreInterface` and `SurfaceToUse` is any subtype of `TpbSurface`. The passed function is called a `SurfaceModifier` and is where you can interact with the surfaces instances and add different stuff to them.
In the above example we are calling the method `addPlugin` to pass a plugin definition that consists of a `name` for the plugin and a `plugiFn` which must be an _async_ function that receives as parameter the `PluginEnvironment` and must return a `Promise<Router>`.

## `BackendPluginInterface` for TechInsights Backend

Now let's take a look at how we can use all of the things that we've just described above to wrap the TechInsights backend plugin into TPB.

First, let's start by looking at our actual implementation of the `BackendPluginInterface` definition.

```
import {
  BackendPluginInterface,
  BackendPluginSurface,
} from '@tpb/core-backend';

export const TechInsightsBackendPlugin: BackendPluginInterface =
  () => surfaces =>
    surfaces.applyTo(BackendPluginSurface, backendPluginSurface => {
      backendPluginSurface.addPlugin({
        name: 'tech-insights',
        pluginFn: createPlugin(),
      });
    });

```

In the above snippet `TechInsightsBackendPlugin` is the main exportable part — the `BackendPluginInterface`; it returns a function that receives a parameter we called `surfaces` wich is a `SurfaceStoreInterface`.

Then we call the function `applyTo` from `surfaces` and we pass as parameters two things: the `BackendPluginSurface` surface, and a function called a `SurfaceModifier` — it is here that we will interact the with the `BackendPluginSurface` instance (`backendPluginSurface`) to define new stuff on it.

Should you need a list of the available surfaces to use when calling `applyTo` you should refer to the [TPB Plugins documentation](../../README.md).

For our particular case we are calling the function `addPlugin` on the `backendPluginSurface` instance and passing to it a `Plugin` definition, which is an object that has a `name` property and another called `pluginFn` — it is in this `pluginFn` where all the heavy lifting of our backend will be defined.

As we've previously mentioned the `pluginFn` must be an _async_ function that receives a `PluginEnvironment` and must return a `Promise<Router>`.
In our example we're assiging the result of calling `createPlugin` to this `pluginFn` so let's take a look at how we've defined `createPlugin`:

```
import {
  createRouter,
  buildTechInsightsContext,
} from '@backstage/plugin-tech-insights-backend';
import { PluginEnvironment } from '@tpb/core-backend';
import { Router } from 'express';

const createPlugin = () => {
  return async (env: PluginEnvironment): Promise<Router> => {
    const builder = await buildTechInsightsContext({
      logger: env.logger,
      config: env.config,
      database: env.database,
      discovery: env.discovery,
      scheduler: env.scheduler,
      tokenManager: env.tokenManager,
      factRetrievers,
      factCheckerFactory,
    });

    return await createRouter({
      ...builder,
      logger: env.logger,
      config: env.config,
    });
  };
};
```

The first thing to notice is that `createPlugin` returns an _async_ function that receives a `PluginEnvironment` and returns a `Promise<Router>`. Now, if you look at the TechInsight Backend plugin documentation in the section ["Backend Example"](https://github.com/backstage/backstage/tree/master/plugins/tech-insights-backend#backend-example) you will see that the example code follows this exact same signature, so we can lift the example code from there and adapt a few small things:

We will use the `PluginEnvironment` to extract environment variables and pass them as parameters to the function `buildTechInsightsContext` in order to create the TechInsight's context. Please notice that in addition to the environment variables we are also passing two variables called `factRetrievers` and `factCheckerFactory` — we will address them later.

This `buildTechInsightsContext` is provided by `@backstage/plugin-tech-insights-backend` so don't forget to run `yarn add @backstage/plugin-tech-insights-backend` to install it as dependency.

Once the context is created we then use it to invoke the function `createRouter` —also provided by `@backstage/plugin-tech-insights-backend`— to create a `Promise<Router>` and return it.

Now let's take a look at `factRetrievers` and `factCheckerFactory`:

The TechInsight documentation provides a very detailed guide on [how to create fact retrievers](https://github.com/backstage/backstage/tree/master/plugins/tech-insights-backend#creating-fact-retrievers) and thus explaining their creation is out of scope for this guide; however I will highlight that this wrapper is using the three fact retrievers [already provided](https://github.com/backstage/backstage/tree/master/plugins/tech-insights-backend#creating-fact-retrievers) by TechInsights. They are: `entityMetadataFactRetriever`, `entityOwnershipFactRetriever`, and `techdocsFactRetriever`.

Using the instructions and examples in TechInsight's documentation we thus define the `factRetrievers` as follows:

```
import {
  createFactRetrieverRegistration,
  entityOwnershipFactRetriever,
  entityMetadataFactRetriever,
  techdocsFactRetriever,
} from '@backstage/plugin-tech-insights-backend';

const factRetrievers = [
  createFactRetrieverRegistration({
    cadence: '0 */6 * * *', // Run every 6 hours - https://crontab.guru/#0_*/6_*_*_*
    factRetriever: entityOwnershipFactRetriever,
    lifecycle: ttlTwoWeeks,
  }),
  createFactRetrieverRegistration({
    cadence: '0 */6 * * *',
    factRetriever: entityMetadataFactRetriever,
    lifecycle: ttlTwoWeeks,
  }),
  createFactRetrieverRegistration({
    cadence: '0 */6 * * *',
    factRetriever: techdocsFactRetriever,
    lifecycle: ttlTwoWeeks,
  }),
];
```

The next step is to define the `factCheckerFactory`.
Please refer to the section [Adding a Fact Checker](https://github.com/backstage/backstage/tree/master/plugins/tech-insights-backend#adding-a-fact-checker) of TechInsight's documentation for in-depth explanation of what this factory is.

For the purpose of this guide is enough to say that this `factCheckerFactory` is what takes your previously-registered fact retrievers and transforms them into "facts" by using the data retrieved by them and running it trough a rules engine.

Our `factCheckerFactory` follows exactly the example provided in TechInsight's documentation and looks as follows:

```
import {
  JsonRulesEngineFactCheckerFactory,
  JSON_RULE_ENGINE_CHECK_TYPE,
} from '@backstage/plugin-tech-insights-backend-module-jsonfc';

const factCheckerFactory = new JsonRulesEngineFactCheckerFactory({
  logger: env.logger,
  checks: [
    {
      id: 'groupOwnerCheck',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      name: 'Group Owner Check',
      description:
        'Verifies that a Group has been set as the owner for this entity',
      factIds: ['entityOwnershipFactRetriever'],
      rule: {
        conditions: {
          all: [
            {
              fact: 'hasGroupOwner',
              operator: 'equal',
              value: true,
            },
          ],
        },
      },
    },
    {
      id: 'titleCheck',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      name: 'Title Check',
      description:
        'Verifies that a Title, used to improve readability, has been set for this entity',
      factIds: ['entityMetadataFactRetriever'],
      rule: {
        conditions: {
          all: [
            {
              fact: 'hasTitle',
              operator: 'equal',
              value: true,
            },
          ],
        },
      },
    },
    {
      id: 'techDocsCheck',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      name: 'TechDocs Check',
      description:
        'Verifies that TechDocs has been enabled for this entity',
      factIds: ['techdocsFactRetriever'],
      rule: {
        conditions: {
          all: [
            {
              fact: 'hasAnnotationBackstageIoTechdocsRef',
              operator: 'equal',
              value: true,
            },
          ],
        },
      },
    },
  ],
})
```

Note that the `JsonRulesEngineFactCheckerFactory` constructor is provided by the package `@backstage/plugin-tech-insights-backend-module-jsonfc` and as such you will need to run `yarn add @backstage/plugin-tech-insights-backend-module-jsonfc` to install it.

Putting all of it together our final `BackendPluginInterface` definition looks like this:

```
import {
  createRouter,
  buildTechInsightsContext,
  createFactRetrieverRegistration,
  entityOwnershipFactRetriever,
  entityMetadataFactRetriever,
  techdocsFactRetriever,
} from '@backstage/plugin-tech-insights-backend';
import {
  JsonRulesEngineFactCheckerFactory,
  JSON_RULE_ENGINE_CHECK_TYPE,
} from '@backstage/plugin-tech-insights-backend-module-jsonfc';
import {
  BackendPluginInterface,
  BackendPluginSurface,
  PluginEnvironment,
} from '@tpb/core-backend';
import { Router } from 'express';

const ttlTwoWeeks = { timeToLive: { weeks: 2 } };

const createPlugin = () => {
  return async (env: PluginEnvironment): Promise<Router> => {
    const context = await buildTechInsightsContext({
      logger: env.logger,
      config: env.config,
      database: env.database,
      discovery: env.discovery,
      scheduler: env.scheduler,
      tokenManager: env.tokenManager,
      factRetrievers: [
        createFactRetrieverRegistration({
          cadence: '0 */6 * * *', // Run every 6 hours - https://crontab.guru/#0_*/6_*_*_*
          factRetriever: entityOwnershipFactRetriever,
          lifecycle: ttlTwoWeeks,
        }),
        createFactRetrieverRegistration({
          cadence: '0 */6 * * *',
          factRetriever: entityMetadataFactRetriever,
          lifecycle: ttlTwoWeeks,
        }),
        createFactRetrieverRegistration({
          cadence: '0 */6 * * *',
          factRetriever: techdocsFactRetriever,
          lifecycle: ttlTwoWeeks,
        }),
      ],
      factCheckerFactory: new JsonRulesEngineFactCheckerFactory({
        logger: env.logger,
        checks: [
          {
            id: 'groupOwnerCheck',
            type: JSON_RULE_ENGINE_CHECK_TYPE,
            name: 'Group Owner Check',
            description:
              'Verifies that a Group has been set as the owner for this entity',
            factIds: ['entityOwnershipFactRetriever'],
            rule: {
              conditions: {
                all: [
                  {
                    fact: 'hasGroupOwner',
                    operator: 'equal',
                    value: true,
                  },
                ],
              },
            },
          },
          {
            id: 'titleCheck',
            type: JSON_RULE_ENGINE_CHECK_TYPE,
            name: 'Title Check',
            description:
              'Verifies that a Title, used to improve readability, has been set for this entity',
            factIds: ['entityMetadataFactRetriever'],
            rule: {
              conditions: {
                all: [
                  {
                    fact: 'hasTitle',
                    operator: 'equal',
                    value: true,
                  },
                ],
              },
            },
          },
          {
            id: 'techDocsCheck',
            type: JSON_RULE_ENGINE_CHECK_TYPE,
            name: 'TechDocs Check',
            description:
              'Verifies that TechDocs has been enabled for this entity',
            factIds: ['techdocsFactRetriever'],
            rule: {
              conditions: {
                all: [
                  {
                    fact: 'hasAnnotationBackstageIoTechdocsRef',
                    operator: 'equal',
                    value: true,
                  },
                ],
              },
            },
          },
        ],
      }),
    });

    return await createRouter({
      ...context,
      logger: env.logger,
      config: env.config,
    });
  };
};

export const TechInsightsBackendPlugin: BackendPluginInterface =
  () => surfaces =>
    surfaces.applyTo(BackendPluginSurface, backendPluginSurface => {
      backendPluginSurface.addPlugin({
        name: 'tech-insights',
        pluginFn: createPlugin(),
      });
    });
```

The final part in creating our TPB backend wrapper is exporting it. We do that in our [package's main](./src/index.ts):

```
export { TechInsightsBackendPlugin as plugin } from './tpb-wrapper';
```

We _strongly_ suggest exporting your `BackendPluginInterface` aliased as `plugin`, just like shown above, to keep your wrapper consistent with the pattern used in other existing TPB wrappers.

## Build and publish the package.

Now the only thing left to do with the wrapper is to package and publish it.

First, remember to verify the version defined in the [package.json](./package.json); then, from the folder of the plugin, run `yarn install` to install all dependencies, then run `yarn tsc` to verify that the typescript code compiles properly, and finally run `yarn build` to package it all.

Once all the above commands have been executed succesfully you should publish the package to any compatible registry by using `npm publish --registry="<<YOUR REGISTRY URL>"`.
Please refer to the [TPB Plugins documentation](../README.md) for considerations about the registries used to publish our packages.

And that's it. You now have a published TPB wrapper for TechInsight's backend plugin.

## Integrate the package into your TPB instance

Refer to the [TPB Plugins main documentation](../README.md) for detailed instructions on how to integrate any published TPB wrapper into your running instance.
