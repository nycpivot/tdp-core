import React from 'react';
import { renderWithEffects } from '@backstage/test-utils';
import { appRenderer } from './appRenderer';
import { ApiSurface, SurfaceStore, ThemeSurface } from '@tpb/core';
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

  async function expectAppIsRendered() {
    const App = appRenderer(store);
    const rendered = await renderWithEffects(<App />);
    expect(rendered.baseElement).toBeInTheDocument();
  }

  function makeApiFactory<T extends any>(api: ApiRef<T>) {
    return createApiFactory<T, any>(api, null);
  }
});
