# Enterprise Service Backstage

This repository contains the core backstage libraries for the Enterprise Service
Backstage product. It is the result of a heavily modified backstage app
so that there is a "single" entrypoint for plugin integration.

Here are the main components of the esback library ecosystem:

- packages/core: Contains the type definitions for developing esback plugin interfaces
- packages/runtime: Objects required to run a backstage frontend
- packages/runtime-backend: Objects required to run a backstage backend
- plugins/\*: Any officially supported Backstage plugin

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

## Extracting TPB Plugins

To extract the plugin source code from the TPB by cloning our [monorepo](https://gitlab.eng.vmware.com/esback/core) into its own repo in order to make individual contributions. 

``` git clone git@gitlab.eng.vmware.com:esback/core.git ```

If you want to create a new plugin, you can use the Backstage [documentation](https://backstage.io/docs/plugins/create-a-plugin/). When the installation is completed, all the plugin code will live in a folder which you can move from the monorepo and use it as an individual project. But first, you want to make sure your new plugin has the correct configuration. 

1.	An app-config.yaml is required in order to run the plugin folder as a standalone project, you can also provide an app-config.local.yaml file. If required by the plugin, you must provide any additional configuration like kubernetes or proxy setup. You should use the TBP app-config.yaml file in order to configure the plugin.
2. It is recommended to change the package name since it comes with the default @internal prefix
3. Update the package.json dependencies to add the plugin dependency provided by the TPB monorepo and required for the plugin.
4. Add the TPB tsconfig.json file.
5. Now you should be able to initialize the repo by executing git init
6.	From here you can run the plugin by executing yarn start inside the plugins folder

If the plugin already exists in TPB. You still need make sure the plugin runs properly by executing yarn start inside the plugin folder before moving the plugin into its own project. 
1.	When executing yarn start inside the plugin folder it creates a DevApp, this DevApp will have the plugin registered and then mounted in the router. This setup is found inside the plugin’s dev/index.tsx file. 
2.	Once the plugin is running properly in isolation it is safe to copy it to a different folder.
3.	From here, we will need to make sure we have the proper TPB configuration. Make sure your existing plugins have the same app-config.yaml and app-config.local.yaml from TPB.

## Surfaces

### Adding the plugin to the Sidebar

You can add your plugin to the main side bar in order to have access to it from TPB. Navigate to ```packages/app/src/components/Root/Root.tsx``` and add a SidebarItem to the ClaritySidebar component, eg:
```
const Root = (props: PropsWithChildren<RootProps>) => (
  <div className={props.classes?.root}>
    <ClarityHeader />
    <ClaritySidebarPage>
      <ClaritySidebar>
        <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
        {/* This will be the new entry for your plugin in the sidebar */}
        <SidebarItem icon={SomeIcon} to="<your-plugin-name>" text="My new plugin">
      </ClaritySidebar>
      <div className={props.classes?.content}>{props.children}</div>
    </ClaritySidebarPage>
  </div>
);
```

### Integrate the plugin into the Software Catalog

The Software Catalog is available to browse at /catalog. The source of truth for the components in your software catalog are metadata YAML files stored in source control. Since we already have the plugin, to integrate our plugin to the Software Catalog we need to read entities from within our plugin. You can access the currently selected entity using the backstage api ```useEntity```. For example,

```
import { useEntity } from '@backstage/plugin-catalog-react';

export const MyPluginEntityContent = () => {
  const { entity, loading, error, refresh } = useEntity();

  // Do something with the entity data...
};
```

Internally ```useEntity``` makes use of react [Contexts](https://reactjs.org/docs/context.html). The entity context is provided by the entity page into which your plugin will be embedded.

After you are able to read the entities from within your plugin, you will need to integrate the plugin and embed it in the entities page. To begin, you will need to import your plugin in the entities page. Located at packages/app/src/components/Catalog/EntityPage.tsx from the root package of your backstage app.

```
import { MyPluginEntityContent } from '@backstage/plugin-my-plugin;
```

To add your component to the Entity view, you will need to modify the packages/app/src/components/Catalog/EntityPage.tsx. Depending on the needs of your plugin, you may only care about certain kinds of entities, each of which has its own element for rendering. This functionality is handled by the EntitySwitch component:

```
export const entityPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isKind('component')} children={componentPage} />
    <EntitySwitch.Case if={isKind('api')} children={apiPage} />
    <EntitySwitch.Case if={isKind('group')} children={groupPage} />
    <EntitySwitch.Case if={isKind('user')} children={userPage} />
    <EntitySwitch.Case if={isKind('system')} children={systemPage} />
    <EntitySwitch.Case if={isKind('domain')} children={domainPage} />

    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);
```

At this point, you will need to modify the specific page where you want your component to appear. If you are extending the Software Catalog model you will need to add a new case to the EntitySwitch. For adding a plugin to an existing component type, you modify the existing page. For example, if you want to add your plugin to the systemPage, you can add a new tab by adding an EntityLayout.Route such as below:

```
const systemPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasComponentsCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasApisCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasResourcesCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/diagram" title="Diagram">
      <EntityCatalogGraphCard variant="gridItem" height={400} />
    </EntityLayout.Route>

    {/* Adding a new tab to the system view */}
    <EntityLayout.Route path="/your-custom-route" title="CustomTitle">
      <MyPluginEntityContent />
    </EntityLayout.Route>
  </EntityLayout>
);
```

For more information, please visit this [link](https://backstage.io/docs/plugins/integrating-plugin-into-software-catalog). 

### Adding the plugin to the routes

Each plugin can export routable extensions, which are then imported into the app and mounted at a path.

First you will need a RouteRef instance to serve as the mount point of your extensions. This can be used within your own plugin to create a link to the extension page using useRouteRef, as well as for other plugins to link to your extension.

It is best to place these in a separate top-level src/routes.ts file, in order to avoid import cycles, for example like this:

```
/* src/routes.ts */
import { createRouteRef } from '@backstage/core-plugin-api';

// Note: This route ref is for internal use only, don't export it from the plugin
export const rootRouteRef = createRouteRef({
  title: 'Example Page',
});
```

Now that we have a RouteRef, we import it into src/plugin.ts, create our plugin instance with createPlugin, as well as create and wrap our routable extension using createRoutableExtension from @backstage/core-plugin-api:

```
/* src/plugin.ts */
import { createPlugin, createRouteRef } from '@backstage/core-plugin-api';
import ExampleComponent from './components/ExampleComponent';

// Create a plugin instance and export this from your plugin package
export const examplePlugin = createPlugin({
  id: 'example',
  routes: {
    root: rootRouteRef, // This is where the route ref should be exported for usage in the app
  },
});

// This creates a routable extension, which are typically full pages of content.
// Each extension should also be exported from your plugin package.
export const ExamplePage = examplePlugin.provide(
  createRoutableExtension({
    name: 'ExamplePage',
    // The component needs to be lazy-loaded. It's what will actually be rendered in the end.
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    // This binds the extension to this route ref, which allows for routing within and across plugin extensions
    mountPoint: rootRouteRef,
  }),
);
```

This extension can then be imported and used in the app as follow, typically placed within the top-level <FlatRoutes>:

```
<Route route="/any-path" element={<ExamplePage />} />
```

### Integrating Search into a plugin

## Running the builder

To run the builder follow the steps in this [guide]().

## Packaging and publishing 

After we have our plugin extracted, we are going to package the plugin and publish it internally to Artifactory. Most plugins share common libraries that currently live inside the packages folder and that need to be published to our npm registry. 

1.	Since these libraries are self-contained it should be pretty straightforward to publish them after adding the following config to the package.json
```
"publishConfig": {
“registry":” https://artifactory.eng.vmware.com/artifactory/api/npm/esback-npm-local/” 
},
```
2.	Provide a local repository to the npm publish command
```npm publish –registry https://artifactory.eng.vmware.com/artifactory/api/npm/esback-npm-local/```

## Add plugin interface

Write a plugin interface that defines how their plugin is integrated into TPB.

## Publishing your plugin

Submit MR against the Core [repo](https://gitlab.eng.vmware.com/esback/core) that includes their new plugin interface.



