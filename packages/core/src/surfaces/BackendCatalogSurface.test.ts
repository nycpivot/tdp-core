import { BackendCatalogSurface } from './BackendCatalogSurface';
import { ConfigReader } from '@backstage/config';
import { FetchUrlReader, getVoidLogger } from '@backstage/backend-common';
import { Router } from 'express';

describe('BackendCatalogSurface', () => {
  it('should build entity providers', () => {
    const providerName = 'fake-entity-provider';
    const surface = new BackendCatalogSurface();
    surface.addEntityProviderBuilder(entityProviderBuilder(providerName));

    const providers = surface.buildProviders(fakePluginEnvironment());

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toBe(providerName);
  });

  it('should build catalog processors', () => {
    const processorName = 'fake-processor-name';
    const surface = new BackendCatalogSurface();
    surface.addCatalogProcessorBuilder(catalogProcessorBuilder(processorName));

    const processors = surface.buildProcessors(fakePluginEnvironment());

    expect(processors).toHaveLength(1);
    expect(processors[0].getProcessorName()).toBe(processorName);
  });

  it('should build catalog', () => {
    const providerName = 'fake-entity-provider';
    const processorName = 'fake-processor-name';
    const surface = new BackendCatalogSurface();

    surface.addEntityProviderBuilder(entityProviderBuilder(providerName));
    surface.addCatalogProcessorBuilder(catalogProcessorBuilder(processorName));
  });

  it('should build routers', () => {
    const routerBuilder = (): Router | Promise<Router> => Router();
    const surface = new BackendCatalogSurface();
    surface.addRouterBuilder(routerBuilder);
    surface.addRouterBuilder(routerBuilder);

    const routers = surface.buildRouters(fakePluginEnvironment());

    expect(routers).toHaveLength(2);
  });
});

function entityProviderBuilder(providerName: string) {
  return () => ({
    connect(): Promise<void> {
      return Promise.resolve(undefined);
    },

    getProviderName(): string {
      return providerName;
    },
  });
}

function catalogProcessorBuilder(processorName: string) {
  return () => ({
    getProcessorName(): string {
      return processorName;
    },

    async readLocation(): Promise<boolean> {
      return true;
    },
  });
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
