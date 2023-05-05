/**
 * @jest-environment jsdom
 */
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { ToggleFeature } from './ToggleFeature';
import { configApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider as ApiProvider } from '@backstage/test-utils';
import { ConfigReader } from '@backstage/config';

describe('<ToggleFeature/>', () => {
  it('should render feature if flag is enabled', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider
        apis={[
          [
            configApiRef,
            new ConfigReader({
              customize: {
                features: {
                  myFeature: {
                    enable: true,
                  },
                },
              },
            }),
          ],
        ]}
      >
        <ToggleFeature feature="customize.features.myFeature.enable">
          <div>my component</div>
        </ToggleFeature>
      </ApiProvider>,
    );
    expect(rendered.getByText('my component')).toBeTruthy();
  });

  it('should not render feature if flag is disabled', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider
        apis={[
          [
            configApiRef,
            new ConfigReader({
              customize: {
                features: {
                  myFeature: {
                    enable: false,
                  },
                },
              },
            }),
          ],
        ]}
      >
        <ToggleFeature
          data-testid="sideBarContainer"
          feature="customize.features.myFeature.enable"
        >
          <div>my component</div>
        </ToggleFeature>
      </ApiProvider>,
    );
    expect(rendered.queryByText('my component')).toBeNull();
  });
});
