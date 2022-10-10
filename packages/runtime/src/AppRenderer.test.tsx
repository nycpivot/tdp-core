import React from 'react';
import { renderWithEffects } from '@backstage/test-utils';
import { AppRenderer } from './AppRenderer';
import { AppSurfaces } from '@esback/core';

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

    const App = AppRenderer(new AppSurfaces())
    const rendered = await renderWithEffects(<App />);
    expect(rendered.baseElement).toBeInTheDocument();
  });
});
