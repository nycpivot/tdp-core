# Enterprise Service Backstage

This repository contains the core backstage libraries for the Enterprise Service
Backstage product. It is the result of a heavily modified backstage app
so that there is a "single" entrypoint for plugin integration.

Here are the main components of the TPB library ecosystem:

- packages/core: Contains the type definitions for developing TPB plugin interfaces
- packages/runtime: Objects required to run a backstage frontend
- packages/runtime-backend: Objects required to run a backstage backend
- plugins/\*: Any officially supported Backstage plugin

## Getting started

To run the most basic version of TPB, simply run this repository as you would a freshly
created Backstage app:

```sh
$ yarn install
$ yarn tsc
$ yarn dev
```

This should open up a backstage instance running on port 7007/3000 (backend/frontend)
with only the [software catalog](https://backstage.io/docs/features/software-catalog/)
enabled.

## Extracting TPB Plugins

Extract the plugin source code from the TPB by cloning our [monorepo](https://gitlab.eng.vmware.com/esback/core) into its own repo in order to make individual contributions.

```sh
$ git clone git@gitlab.eng.vmware.com:esback/core.git
```

If you want to create a new plugin, you can use this [documentation](https://gitlab.eng.vmware.com/esback/core/-/tree/main/plugins) as reference. When the installation is completed, all the plugin code will live in a folder which you can move from the monorepo and use it as an individual project. But first, you want to make sure your new plugin has the correct configuration.

1. An app-config.yaml is required in order to run the plugin folder as a standalone project, you can also provide an app-config.local.yaml file. If required by the plugin, you must provide any additional configuration like [kubernetes](https://backstage.io/docs/features/kubernetes/configuration/) or [proxy](https://backstage.io/docs/plugins/proxying) setup. You should use the TBP app-config.yaml file in order to configure the plugin.
2. Update the package.json dependencies to add the plugin dependency provided by the TPB monorepo and required for the plugin.
3. Add the TPB tsconfig.json file.
4. Now you should be able to initialize the repo by executing `git init`
5. From here you can run the plugin by executing `yarn start` inside the plugins folder

If the plugin already exists in TPB. You still need make sure the plugin runs properly by executing `yarn start` inside the plugin folder before moving the plugin into its own project.

1. When executing `yarn start` inside the plugin folder, it will have the plugin registered and then mounted in the router. This setup is found inside the plugin’s src/index.tsx file.
2. Once the plugin is running properly in isolation it is safe to copy it to a different folder.
3. From here, we will need to make sure we have the proper TPB configuration. Make sure your existing plugins have the same app-config.yaml and app-config.local.yaml from TPB.

## Surfaces

Our surfaces consists of a few distinct groups of functionalities we can individually add to our plugins. In this section we show an example of each of the currently available surfaces in our project.

### SidebarItemSurface

You can add your plugin to the main side bar in order to have access to it from TPB. Navigate to `Plugin.ts` and add a SidebarItemSurface to your plugin. First you will need to import the SidebarItemSurface library `import { SidebarItemSurface } from '@tpb/core';`, eg:

```
context.applyTo(SidebarItemSurface, sidebar =>
  sidebar.addMainItem(
    <SidebarItem icon={AlarmIcon} to="hello-world" text="Hello" />,
  ),
);
```

### LoginSurface

To use the LoginSurface, in your Auth plugins, first import the library `import { LoginSurface } from '@tpb/plugin-login';` to your Plugin.ts. Then we proceed to as the surface as shown below:

```
surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(configApi, defaultConfig, 'auth0'),
        apiRef: auth0AuthApiRef,
      }),
      enabled: (configApi: ConfigApi) => configApi.has('auth.providers.auth0'), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: 'auth0',
    });
  });
```

### ApiSurface

Similar as the LoginSurface, the ApiSurface should look something like:

```
import { ApiSurface } from '@tpb/core';
...

surfaces.applyTo(ApiSurface, surface => {
    surface.add(
      createApiFactory({
        api: auth0AuthApiRef,
        deps: {
          discoveryApi: discoveryApiRef,
          oauthRequestApi: oauthRequestApiRef,
          configApi: configApiRef,
        },
        factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
          OAuth2.create({
            discoveryApi,
            oauthRequestApi,
            provider: {
              id: 'auth0',
              title: 'Auth0',
              icon: () => null,
            },
            defaultScopes: ['openid', 'email', 'profile', 'offline_access'],
            environment: configApi.getOptionalString('auth.environment'),
          }),
      }),
    );
  });
```

### BackendCatalogSurface

```
import { BackendCatalogSurface } from '@tpb/core';

...

export const MicrosoftGraphOrgReaderProcessorPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyWithDependency(
      BackendCatalogSurface,
      MicrosoftGraphOrgReaderProcessorTransformersSurface,
      (
        backendCatalogSurface,
        microsoftGraphOrgReaderProcessorTransformersSurface,
      ) => {
        backendCatalogSurface.addCatalogProcessorBuilder(
          (env: PluginEnvironment) => {
            return MicrosoftGraphOrgReaderProcessor.fromConfig(env.config, {
              logger: env.logger,
              userTransformer:
                microsoftGraphOrgReaderProcessorTransformersSurface.userTransformer(),
              groupTransformer:
                microsoftGraphOrgReaderProcessorTransformersSurface.groupTransformer(),
              organizationTransformer:
                microsoftGraphOrgReaderProcessorTransformersSurface.organizationTransformer(),
            });
          },
        );
      },
    );
  };
```

### MicrosoftGraphOrgReaderProcessorTransformersSurface

```
import { MicrosoftGraphOrgReaderProcessorTransformersSurface } from './MicrosoftGraphOrgReaderProcessorTransformersSurface';

...

export const MicrosoftGraphOrgReaderProcessorPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyWithDependency(
      BackendCatalogSurface,
      MicrosoftGraphOrgReaderProcessorTransformersSurface,
      (
        backendCatalogSurface,
        microsoftGraphOrgReaderProcessorTransformersSurface,
      ) => {
        backendCatalogSurface.addCatalogProcessorBuilder(
          (env: PluginEnvironment) => {
            return MicrosoftGraphOrgReaderProcessor.fromConfig(env.config, {
              logger: env.logger,
              userTransformer:
                microsoftGraphOrgReaderProcessorTransformersSurface.userTransformer(),
              groupTransformer:
                microsoftGraphOrgReaderProcessorTransformersSurface.groupTransformer(),
              organizationTransformer:
                microsoftGraphOrgReaderProcessorTransformersSurface.organizationTransformer(),
            });
          },
        );
      },
    );
  };
```

### SignInProviderSurface

```
import { SignInProviderSurface } from '@tpb/plugin-auth-backend';

...

export const OidcAuthBackendPlugin: BackendPluginInterface = () => store => {
  store.applyWithDependency(
    SignInProviderSurface,
    SignInResolverSurface,
    (providerSurface, resolverSurface) => {
      providerSurface.add({
        oidc: providers.oidc.create({
          signIn: {
            resolver: resolverSurface.getResolver('oidc'),
          },
        }),
      });
    },
  );
};
```

### SignInResolverSurface

```
import { SignInResolverSurface } from '@tpb/plugin-auth-backend';
const resolver: SignInResolver<TAuthResult>

...

export const SomeAuthProviderSignInResolverPlugin: BackendPluginInterface = () => store => {
   store.applyTo(SignInResolverSurface, (resolverSurface) => {
      resolverSurface.add('authProviderKey', resolver)
   })
};
```

### LdapSurface

```
import { LdapSurface } from '@tpb/plugin-ldap-backend';

...

export const LdapTransformersPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(LdapSurface, surface => {
      surface.setGroupTransformerBuilder(() => {
        return async (vendor, config, entry) => {
          const entity = await defaultGroupTransformer(vendor, config, entry);
          if (entity) {
            entity.metadata.description =
              'Description added by custom group transformer !';
          }
          return entity;
        };
      });

      surface.setUserTransformerBuilder(() => {
        return async (vendor, config, entry) => {
          const entity = await defaultUserTransformer(vendor, config, entry);
          if (entity) {
            entity.metadata.description =
              'Description added by custom user transformer !';
          }
          return entity;
        };
      });
    });
  };
```

### BackendPluginSurface

```

```

### AppRouteSurface

```
import { AppRouteSurface } from '@tpb/core';

...

export const AppLiveViewPlugin: AppPluginInterface = () => context => {
  context.applyTo(AppRouteSurface, surface => {
    surface.add(<Route path="/app-live-view" element={<AppLiveViewPage />} />);
  });
};
```

### AppComponentSurface

```
import { AppComponentSurface } from '@tpb/core';

...

export const LoginPlugin: AppPluginInterface = () => {
  return context => {
    context.applyWithDependency(
      AppComponentSurface,
      LoginSurface,
      (appComponentSurface, loginSurface) => {
        if (loginSurface.hasProviders()) {
          appComponentSurface.add('SignInPage', props => {
            return (
              <SignInPageWrapper
                onSignInSuccess={props.onSignInSuccess}
                loginSurface={loginSurface}
              />
            );
          });
        }
      },
    );
  };
};


```

### ThemeSurface

```
import { ThemeSurface } from '@tpb/core';

...

const BackstageLight: AppTheme = {
  id: 'backstage-light',
  title: 'Light',
  variant: 'light',
  Provider: ({ children }) => (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline>{children}</CssBaseline>
    </ThemeProvider>
  ),
};

const BackstageDark: AppTheme = {
  id: 'backstage-dark',
  title: 'Dark',
  variant: 'dark',
  Provider: ({ children }) => (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline>{children}</CssBaseline>
    </ThemeProvider>
  ),
};

export const ThemePlugin: AppPluginInterface = () => {
  return context => {
    context.applyTo(ThemeSurface, surface => {
      surface.addTheme(BackstageLight);
      surface.addTheme(BackstageDark);
      surface.setRootBuilder(children => (
        <Root sidebar={context.findSurface(SidebarItemSurface)}>
          {children}
        </Root>
      ));
    });
  };
};

```

### SettingsTabsSurface

```
import React from 'react';
import {
  AppPluginInterface,
  SettingsTabsSurface,
} from '@tpb/core';
import { SettingsLayout } from '@backstage/plugin-user-settings';

export const HelloWorldPlugin: AppPluginInterface = () => context => {
  context.applyTo(SettingsTabsSurface, tabs =>
    tabs.add(
      <SettingsLayout.Route path="/hello-world" title="Hello World Tab">
        <div>Hello World Settings Tab Content</div>
      </SettingsLayout.Route>,
    ),
  );
};
```

### BannerSurface

```
import React from 'react';
import { BannerSurface } from '@tpb/core';

export const HelloWorldPlugin: AppPluginInterface = () => context => {
  context.applyTo(BannerSurface, banners => {
    banners.add(
        <div>Hello World Banner</div>
    );
  });
};
```

### EntityPageSurface

This surface can be used to customize the page displayed when an entity is selected.

There are different [kinds of entities](https://backstage.io/docs/features/software-catalog/descriptor-format/#kind-component) that are supported:

It is possible to add a new tab to one of those entity pages. Let's say that we want to customize the API Page, here is how it can be done:

```jsx
import React from 'react';
import { EntityPageSurface } from '@tpb/plugin-catalog';

export const HelloWorldPlugin: AppPluginInterface = () => context => {
  context.applyTo(EntityPageSurface, surface => {
    surface.apiPage.addTab(<div>I am a new tab</div>);
  });
};
```

There is a configurable page per kind of entity.

### Customizing API Page

The API page overview can also be customized:

```jsx
import React from 'react';
import { EntityPageSurface } from '@tpb/plugin-catalog';
import { Grid } from '@material-ui/core';

export const HelloWorldPlugin: AppPluginInterface = () => context => {
  context.applyTo(EntityPageSurface, surface => {
    surface.apiPage.addOverviewContent(
      <Grid item md={6} xs={12}>
        <div>I am an Hello World overview!</div>
      </Grid>,
    );
  });
};
```

### Customizing component pages

If a component is not supported by the TPB, it is possible to add a new page for it:

```jsx
import React from 'react';
import { EntityPageSurface } from '@tpb/plugin-catalog';
import { isComponentType, EntitySwitch } from '@backstage/plugin-catalog';

export const HelloWorldPlugin: AppPluginInterface = () => context => {
  context.applyTo(EntityPageSurface, surface => {
    surface.addComponentPageCase(
      <EntitySwitch.Case if={isComponentType('foo')}>
        <div>i am foo</div>
      </EntitySwitch.Case>,
    );
  });
};
```

## Toggle Features

It is possible to render or not components based on properties defined in the configuration.

To hide the catalog in the sidebar for example, you can add this property to your configuration:

```yaml
customize:
  features:
    catalog:
      showInSidebar: false
```

Here are some features that can be toggled:

| Feature             | Property                                  |
| ------------------- | ----------------------------------------- |
| catalog in sidebar  | customize.features.catalog.showInSidebar  |
| techdocs in sidebar | customize.features.docs.showInSidebar     |
| api docs in sidebar | customize.features.apiDocs.showInSidebar  |
| search in sidebar   | customize.features.search.showInSidebar   |
| settings in sidebar | customize.features.settings.showInSidebar |

If a property is not set, its value is `true` by default.

Any frontend plugin can leverage on this mechanism following these steps:

1. Create a `config.d.ts` file that defines the name of the toggle feature property.

_Example:_

```typescript
export interface Config {
  customize?: {
    features?: {
      apiDocs?: {
        /**
         * Show or hide the sidebar entry. Default: true
         * @visibility frontend
         */
        showInSidebar?: boolean;
      };
    };
  };
}
```

The `@visibility` annotation is required if you want the property to be taken into account.

Place this file at the root of the plugin folder.

2. Add a `configSchema` property in the `package.json` file of the plugin

```json
  "configSchema": "config.d.ts",
```

3. Add the `config.d.ts` file to list of files to publish in the `package.json` file:

```json
"files": [
    "dist",
    "config.d.ts"
  ]
```

4. Add a dependency to the `@tpb/core-frontend` package in the `package.json` file

5. Use the `ToggleFeature` component to wrap the component that you want to hide or show depending on the property you have defined.

_Example:_

```typescript jsx
context.applyTo(SidebarItemSurface, sidebar =>
  sidebar.addMainItem(
    <ToggleFeature feature="customize.features.apiDocs.showInSidebar">
      <SidebarItem icon={Extension} to={path} text={label} />
    </ToggleFeature>,
  ),
);
```

## Running the builder

To run the builder follow the steps in the Getting Started section of this guide.

## Packaging and publishing

After we have our plugin extracted, we are going to package the plugin and publish it internally to Artifactory. Most plugins share common libraries that currently live inside the packages folder and that need to be published to our npm registry.

```
"publishConfig": {
“registry":” https://artifactory.eng.vmware.com/artifactory/api/npm/tpb-npm-local/”
},
```

2. Provide a local repository to the npm publish command
   `npm publish –registry https://artifactory.eng.vmware.com/artifactory/api/npm/tpb-npm-local/`

## Add plugin interface

Write a plugin interface that defines how their plugin is integrated into TPB. The plugin interfaces live in `src/index.ts` and can be implemented in your plugin as shown below:

```
export const HelloWorldPlugin: AppPluginInterface = () => context => {
  context.applyTo(AppRouteSurface, routes =>
    routes.add(<Route path="/hello-world" element={<h1>Hello World!!</h1>} />),
  );

  context.applyTo(SidebarItemSurface, sidebar =>
    sidebar.addMainItem(
      <SidebarItem icon={AlarmIcon} to="hello-world" text="Hello" />,
    ),
  );
};
```

## Publishing your plugin

Submit MR against the Core [repo](https://gitlab.eng.vmware.com/esback/core) that includes their new plugin interface.
