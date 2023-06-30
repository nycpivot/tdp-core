# Tanzu Portarl Builder (TPB) - TechInsights FrontEnd Wrapper

## Introduction and OOTB features

This code is a thin-wrapper for the [TechInsights frontend plugin](https://github.com/backstage/backstage/tree/master/plugins/tech-insights) that, by default, includes a scorecard that showcases the results of the following 3 fact checkers [already provided](https://github.com/backstage/backstage/tree/master/plugins/tech-insights-backend#included-factretrievers) by TechInsights:

- entityOwnershipFactRetriever
- entityMetadataFactRetriever
- techdocsFactRetriever

Used in conjunction with the [Backend wrapper](../tpb-techinsights-backend/) it brings TechInsight's default functionalities into TPB. The end result looks similar to this:

![TechInsights Entity Scorecard](./docs/techinsights-scorecard.png)

## Plugin Wrapper Overview

This wrapper uses the concept of [Surfaces](../../README.md#frontend-plugins) to incorporate the TechInsights plugin into TPB.

What follows is a technical explanation of how this wrapping is done using the Surfaces APIs.

### Plugin Boilerplate

Let's create our plugin folder structure by making a copy of the [tpb-hello-world plugin](../tpb-hello-world/) and modifying its contents.
Dont' forget to modify the `package.json` file to reflect the name and version of your wrapper. For this example we've used `@tpb/plugin-techinsights` to keep the pattern used by other plugins.

### Defining an `AppPluginInterface`

In order for TPB to pick up the plugin we need to create a definition of type `AppPluginInterface` which is defined by the `@tpb/core-frontend` package. This package should already be included in your dependencies if you created the boilerplate following the instructions above.

This definition is a high-order-function that returns a function that takes in as parameter the `SurfaceStoreInterface`; this `SurfaceStoreInterface` will be then used to _apply_ the dependencies to the specified surfaces.

A barebones definition of a plugin may look like the following:

```
export const PluginDefinition: AppPluginInterface = () => context: SurfaceStoreInterface => {
  context.apply(
    SurfaceToUseConstructor
    (surfaceToUse) => {
      surfaceToUse.add(element)
    },
  );
};

```

where `context` is of type `SurfaceStoreInterface`; `SurfaceToUseConstructor` is any subtype of `TpbSurface`, and the passed function is called a `SurfaceModifier` which is where you can interact with the surfaces instances and add different stuff to them.
In the above example we are calling the method `add` to pass an `element` which is a `ReactElement`.

There are scenarios in which more surfaces need to be manipulated in order to integrate the plugin —such as this wrapper— and for those use cases the `SurfaceStoreInterface` exposes the method `applyWithDependency` in which it is possible to pass several `SurfaceConstructor` dependencies which will be then made available to the `SurfaceModifier` function as parameters.

## `AppPluginInterface` for TechInsights

Now let's take a look at how we can use all of the things that we've just described above to wrap the TechInsights plugin into TPB.

First, let's start by looking at our actual implementation of the `AppPluginInterface` definition.

```
import { EntityLayout } from '@backstage/plugin-catalog';
import { EntityTechInsightsScorecardContent } from '@backstage/plugin-tech-insights';
import {
  AppPluginInterface,
  AppRouteSurface,
  SurfaceStoreInterface,
} from '@tpb/core-frontend';
import { EntityPageSurface } from '@tpb/plugin-catalog';
import React from 'react';

export const TechInsightsFrontendPlugin: AppPluginInterface =
  () => (context: SurfaceStoreInterface) => {
    context.applyWithDependency(
      AppRouteSurface,
      EntityPageSurface,
      (_appRouteSurface, entityPageSurface) => {
        entityPageSurface.servicePage.addTab(
          <EntityLayout.Route path="/techinsights" title="TechInsights">
            <EntityTechInsightsScorecardContent
              title="TechInsights Scorecard."
              description="TechInsight's default fact-checkers"
            />
          </EntityLayout.Route>,
        );
      },
    );
  };

```

Let's analyze it:

`TechInsightsFrontenPlugin` is the main exportable part — the `AppPluginInterface` definition; it returns a function that receives a parameter we called `context` which is a `SurfaceStoreInterface`.

Then the function `applyWithDependency` is invoked from the `context` with two TPB Surfaces: `AppRouteSurface` and `EntityPageSurface`.

At this point you may be wondering: how do we know which surfaces are needed?
The answer is that it depends on the parts of the application that you want to modify. For this particular scenario we see in the [TechInsights FrontEnd Documentation](https://github.com/backstage/backstage/blob/master/plugins/tech-insights/README.md#add-boolean-checks-overview-scorecards-page-to-the-entitypage) that adding an `EntityTechInsightsScorecardContent` requires modifying the `EntityPage` — specifically adding a nested route to it. So we require the `EntityPageSurface` so that we can add stuff to it; we also require the `AppRouteSurface` because we are adding a new route to the application.

A comprehensive list of the available surfaces can be found [here](../../README.md) — However, do note that as the platform expands in features new surfaces will be made available and other plugins may also expose surfaces to use (such as in this case, where we obtain the `EntityPageSurface` from the `@tpb/plugin-catalog` package — don't forget to install it as a dependency: `yarn add @tpb/plugin-catalog`).

After figuring out our surfaces and installing the necessary dependencies for them, the last parameter that `applyWithDependency` receives is the `SurfaceModifier` function. This is where actual instances of the surfaces are provided to us in order to interact with them. In the example above we are obtaining the `servicePage` of the `EntityPageSurface` and calling `addTab` on it with a `ReactElement` being passed as parameter to the function.
This `ReactElement` consists of an `EntityLayout.Route` (obtained from `@backstage/plugin-catalog` so don't forget to install it as a dependency) and nested within it we find the scorecard component: the `EntityTechInsightsScorecardContent`. This component is provided by TechInsights plugin itself, so don't forget to install it: `yarn add '@backstage/plugin-tech-insights'`.

The final part in creating our TPB plugin wrapper is exporting it. We do that in our [package's main](./src/index.ts):

```
export { TechInsightsFrontendPlugin as plugin } from './tpb-wrapper';

```

We _strongly_ suggest exporting your `AppPluginInterface` aliased as `plugin`, just like shown above, to keep your wrapper consistent with the pattern used in other existing TPB wrappers.

## Build and publish the package.

Now the only thing left to do with the wrapper is to package and publish it.

First, remember to verify the version defined in the [package.json](./package.json); then, from the folder of the plugin, run `yarn install` to install all dependencies, then run `yarn tsc` to verify that the typescript code compiles properly, and finally run `yarn build` to package it all.

Once all the above commands have been executed succesfully you should publish the package to any compatible registry by using `npm publish --registry="<<YOUR REGISTRY URL>"`.
Please refer to the [TPB Plugins documentation](../README.md) for considerations about the registries used to publish our packages.

And that's it. You now have a published TPB wrapper.

## Integrate the package into your TPB instance

Refer to the [TPB Plugins main documentation](../README.md) for detailed instructions on how to integrate any published TPB wrapper into your running instance.
