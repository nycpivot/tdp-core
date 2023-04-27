import React from 'react';
import { renderWithEffects } from '@backstage/test-utils';
import { appRenderer } from './appRenderer';
import { ApiSurface, SurfaceStore, ThemeSurface } from '@tpb/core';
import {ApiRef, configApiRef, createApiFactory,} from '@backstage/core-plugin-api';

const makeApiFactory = <T extends any>(api: ApiRef<T>) =>
  createApiFactory<T, any>(api, null);

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

  it('should render', async () => {
    const App = appRenderer(store);
    const rendered = await renderWithEffects(<App />);
    expect(rendered.baseElement).toBeInTheDocument();
  });

  it('should not add an api that conflicts with the config api', async () => {
    store.applyTo(ApiSurface, surface => {
      surface.add(makeApiFactory(configApiRef));
    });

    const App = appRenderer(store);
    const rendered = await renderWithEffects(<App />);
    expect(rendered.baseElement).toBeInTheDocument();
  });
});
