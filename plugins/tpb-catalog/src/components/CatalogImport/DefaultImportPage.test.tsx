import { CatalogClient } from '@backstage/catalog-client';
import { ConfigReader } from '@backstage/core-app-api';
import { TestApiProvider as ApiProvider } from '@backstage/test-utils';
import { configApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import {
  catalogImportApiRef,
  CatalogImportClient,
} from '@backstage/plugin-catalog-import';
import { DefaultImportPage } from './DefaultImportPage';

describe('<DefaultImportPage />', () => {
  const identityApi = {
    getUserId: () => {
      return 'user';
    },
    getProfile: () => {
      return {};
    },
    getIdToken: () => {
      return Promise.resolve('token');
    },
    signOut: () => {
      return Promise.resolve();
    },
    getProfileInfo: jest.fn(),
    getBackstageIdentity: jest.fn(),
    getCredentials: jest.fn(),
  };

  it('renders without exploding', async () => {
    const { getByText } = await renderInTestApp(
      <ApiProvider
        apis={[
          [configApiRef, new ConfigReader({ integrations: {} })],
          [catalogApiRef, new CatalogClient({ discoveryApi: {} as any })],
          [
            catalogImportApiRef,
            new CatalogImportClient({
              discoveryApi: {} as any,
              scmAuthApi: {} as any,
              identityApi,
              scmIntegrationsApi: {} as any,
              catalogApi: {} as any,
              configApi: {} as any,
            }),
          ],
        ]}
      >
        <DefaultImportPage />
      </ApiProvider>,
    );

    expect(
      getByText('Start tracking your component in Tanzu Application Platform'),
    ).toBeInTheDocument();
  });
});
