/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expectAppIsNotRendered", "expectAppIsRendered"] }] */
import React from 'react';
import { renderWithEffects } from '@backstage/test-utils';
import { appRenderer } from './appRenderer';
import {
  ApiSurface,
  AppPluginSurface,
  SurfaceStore,
  ThemeSurface,
} from '@tpb/core';
import {
  ApiRef,
  appThemeApiRef,
  configApiRef,
  createApiFactory,
  identityApiRef,
} from '@backstage/core-plugin-api';

describe('AppRenderer', () => {
  let store: SurfaceStore;

  beforeEach(() => {
    process.env = {
      NODE_ENV: 'test',
      APP_CONFIG: [
        {
          data: {
            app: { title: 'Test' },
            backend: { baseUrl: 'http://localhost:7007' },
          },
          context: 'test',
        },
      ] as any,
    };

    store = new SurfaceStore();
    store.applyTo(ThemeSurface, surface => {
      surface.addTheme({
        id: 'theme',
        title: 'dummy theme',
        variant: 'light',
        Provider(): JSX.Element | null {
          return null;
        },
      });
      surface.setRootBuilder(children => <div>{children}</div>);
    });
  });

  it('should render by default', async () => {
    await expectAppIsRendered();
  });

  it('should render when an api conflicts with the config api', async () => {
    store.applyTo(ApiSurface, surface => {
      surface.add(makeApiFactory(configApiRef));
    });

    await expectAppIsRendered();
  });

  it('should render when an api conflicts with the theme api', async () => {
    store.applyTo(ApiSurface, surface => {
      surface.add(makeApiFactory(appThemeApiRef));
    });

    await expectAppIsRendered();
  });

  it('should render when an api conflicts with the identity api', async () => {
    store.applyTo(ApiSurface, surface => {
      surface.add(makeApiFactory(identityApiRef));
    });

    await expectAppIsRendered();
  });

  // TODO: ESBACK-311 - this is how it works for the moment but that might change with this ticket.
  it('should not render when a plugin conflicts with the config api', async () => {
    store.applyTo(AppPluginSurface, surface => {
      surface.add(makePlugin(configApiRef));
    });

    await expectAppIsNotRendered(duplicateApiError(configApiRef));
  });

  // TODO: ESBACK-311 - this is how it works for the moment but that might change with this ticket.
  it('should not render when a plugin conflicts with the theme api', async () => {
    store.applyTo(AppPluginSurface, surface => {
      surface.add(makePlugin(appThemeApiRef));
    });

    await expectAppIsNotRendered(duplicateApiError(appThemeApiRef));
  });

  // TODO: ESBACK-311 - this is how it works for the moment but that might change with this ticket.
  it('should not render when a plugin conflicts with the identity api', async () => {
    store.applyTo(AppPluginSurface, surface => {
      surface.add(makePlugin(identityApiRef));
    });

    await expectAppIsNotRendered(duplicateApiError(identityApiRef));
  });

  async function expectAppIsRendered() {
    const App = appRenderer(store);
    const rendered = await renderWithEffects(<App />);
    expect(rendered.baseElement).toBeInTheDocument();
  }

  async function expectAppIsNotRendered(expectedError: string) {
    const App = appRenderer(store);
    await expect(renderWithEffects(<App />)).rejects.toThrow(expectedError);
  }

  function duplicateApiError(api: ApiRef<any>) {
    return `Plugin my.plugin tried to register duplicate or forbidden API factory for apiRef{${api.id}}`;
  }

  function makeApiFactory<T extends any>(api: ApiRef<T>) {
    return createApiFactory<T, any>(api, null);
  }

  function makePlugin<T extends any>(api: ApiRef<T>) {
    return {
      __experimentalReconfigure(): void {},
      externalRoutes: {},
      routes: {},
      getApis() {
        return [makeApiFactory(api)];
      },
      getFeatureFlags() {
        return [];
      },
      getId() {
        return 'my.plugin';
      },
      provide<U>(): U {
        throw new Error('should not be called');
      },
    };
  }
});
