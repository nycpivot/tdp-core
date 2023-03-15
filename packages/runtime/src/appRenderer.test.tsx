import React from 'react';
import { renderWithEffects } from '@backstage/test-utils';
import { appRenderer } from './appRenderer';
import { SurfaceStore, ThemeSurface } from '@tpb/core';

describe('AppRenderer', () => {
  it('should render', async () => {
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

    const store = new SurfaceStore();
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
    const App = appRenderer(store);
    const rendered = await renderWithEffects(<App />);
    expect(rendered.baseElement).toBeInTheDocument();
  });
});
