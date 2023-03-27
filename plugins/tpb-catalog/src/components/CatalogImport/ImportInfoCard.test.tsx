import { ConfigReader } from '@backstage/core-app-api';
import { TestApiProvider as ApiProvider } from '@backstage/test-utils';
import { configApiRef } from '@backstage/core-plugin-api';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import {
  CatalogImportApi,
  catalogImportApiRef,
} from '@backstage/plugin-catalog-import';
import { ImportInfoCard } from './ImportInfoCard';

describe('<ImportInfoCard />', () => {
  let catalogImportApi: jest.Mocked<CatalogImportApi>;

  beforeEach(() => {
    catalogImportApi = {
      analyzeUrl: jest.fn(),
      submitPullRequest: jest.fn(),
    };
  });

  it('renders without exploding', async () => {
    const { getByText } = await renderInTestApp(
      <ApiProvider
        apis={[
          [
            configApiRef,
            new ConfigReader({
              integrations: {},
            }),
          ],
          [catalogImportApiRef, catalogImportApi],
        ]}
      >
        <ImportInfoCard />
      </ApiProvider>,
    );

    expect(getByText('Register an existing component')).toBeInTheDocument();
  });
});
