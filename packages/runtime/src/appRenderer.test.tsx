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

  it('should not render when a plugin conflicts with the config api', async () => {
    store.applyTo(AppPluginSurface, surface => {
      surface.add(makePlugin(configApiRef));
    });

    const App = appRenderer(store);
    await expect(renderWithEffects(<App />)).rejects.toThrow(
      'Plugin my.plugin tried to register duplicate or forbidden API factory for apiRef{core.config}',
    );
  });

  async function expectAppIsRendered() {
    const App = appRenderer(store);
    const rendered = await renderWithEffects(<App />);
    expect(rendered.baseElement).toBeInTheDocument();
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
      provide<T>(): T {
        throw new Error('should not be called');
      },
    };
  }
});
