import {BackendCatalogSurface} from "./BackendCatalogSurface";
import {PluginEnvironment} from "../PluginEnvironment";
import {EntityProvider} from "@backstage/plugin-catalog-backend";
import {ConfigReader} from "@backstage/config";
import {FetchUrlReader, getVoidLogger} from "@backstage/backend-common";

describe('BackendCatalogSurface', () => {
  it('should build entity providers', () => {
    const surface = new BackendCatalogSurface();
    const entityProvider: EntityProvider = {
      connect(): Promise<void> {
        return Promise.resolve(undefined);
      },

      getProviderName(): string {
        return "fake-entity-provider";
      }

    }
    surface.addEntityProviderBuilder(() => {
      return [entityProvider]
    })

    const env: PluginEnvironment = {
      cache: {
        getClient: jest.fn()
      },
      config: new ConfigReader({}),
      database: {
        getClient: jest.fn(),
      },
      discovery: {
        getBaseUrl: jest.fn(),
        getExternalBaseUrl:  jest.fn()
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
      }
    }
    const providers = surface.buildProviders(env);
    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toBe("fake-entity-provider");
  })
})