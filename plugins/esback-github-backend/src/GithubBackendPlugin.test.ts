import { BackendCatalogSurface, SurfaceStore } from '@esback/core';
import { GithubBackendPlugin } from './GithubBackendPlugin';
import {
  GithubEntityProvider,
  GitHubOrgEntityProvider,
} from '@backstage/plugin-catalog-backend-module-github';
import { FetchUrlReader, getVoidLogger } from '@backstage/backend-common';
import { MockConfigApi } from '@backstage/test-utils';

const mockEntityProvider = jest
  .spyOn(GithubEntityProvider, 'fromConfig')
  .mockImplementation();

const mockOrgProvider = jest
  .spyOn(GitHubOrgEntityProvider, 'fromConfig')
  .mockImplementation();

describe('GithubBackendPlugin', () => {
  it('Skips org processor when not configured', () => {
    const store = new SurfaceStore();
    GithubBackendPlugin()(store);

    const catalogSurface = store.getSurfaceState(BackendCatalogSurface);
    const providers = catalogSurface.buildProviders(fakePluginEnvironment());

    expect(mockEntityProvider).toBeCalled();
    expect(mockOrgProvider).not.toBeCalled();
    expect(providers).toHaveLength(1);
  });

  it('Adds org processor when configured', () => {
    const fakeConfig = new MockConfigApi({
      esback: {
        catalog: {
          providers: {
            github: {
              orgEntity: {
                orgUrl: 'fakeorg',
              },
            },
          },
        },
      },
    });
    const store = new SurfaceStore();
    GithubBackendPlugin()(store);

    const catalogSurface = store.getSurfaceState(BackendCatalogSurface);
    const providers = catalogSurface.buildProviders(
      fakePluginEnvironment(fakeConfig),
    );

    expect(mockEntityProvider).toBeCalled();
    expect(mockOrgProvider).toBeCalled();
    expect(providers).toHaveLength(2);
  });
});

// This code is partially duplicated from core/src/surfaces/BackendCatalogSurface.test.ts. Might be
// a good candidate for a test helpers library
function fakePluginEnvironment(config: MockConfigApi = new MockConfigApi({})) {
  return {
    cache: {
      getClient: jest.fn(),
    },
    config,
    database: {
      getClient: jest.fn(),
    },
    discovery: {
      getBaseUrl: jest.fn(),
      getExternalBaseUrl: jest.fn(),
    },
    logger: getVoidLogger(),
    permissions: {
      authorize: jest.fn(),
      authorizeConditional: jest.fn(),
    },
    reader: new FetchUrlReader(),
    scheduler: {
      createScheduledTaskRunner: jest.fn(),
      scheduleTask: jest.fn(),
      triggerTask: jest.fn(),
    },
    tokenManager: {
      authenticate: jest.fn(),
      getToken: jest.fn(),
    },
  };
}
