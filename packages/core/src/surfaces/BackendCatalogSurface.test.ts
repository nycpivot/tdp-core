import { BackendCatalogSurface } from './BackendCatalogSurface';
import { ConfigReader } from '@backstage/config';
import { FetchUrlReader, getVoidLogger } from '@backstage/backend-common';

describe('BackendCatalogSurface', () => {
  it('should build entity providers', () => {
    const providerName = 'fake-entity-provider';
    const surface = new BackendCatalogSurface();
    surface.addEntityProviderBuilder(entityProviderBuilder(providerName));

    const providers = surface.buildProviders(fakePluginEnvironment());

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toBe(providerName);
  });
});

function entityProviderBuilder(providerName: string) {
  const entityProvider = {
    connect(): Promise<void> {
      return Promise.resolve(undefined);
    },

    getProviderName(): string {
      return providerName;
    },
  };
  const entityProviderBuilder = () => {
    return [entityProvider];
  };
  return entityProviderBuilder;
}

function fakePluginEnvironment() {
  return {
    cache: {
      getClient: jest.fn(),
    },
    config: new ConfigReader({}),
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
