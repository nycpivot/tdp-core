import { ApiSurface } from './ApiSurface';
import {
  configApiRef,
  createApiFactory,
  createApiRef,
} from '@backstage/core-plugin-api';

describe('Api Surface', () => {
  it('should register apis', () => {
    const surface = new ApiSurface();

    const factory1 = makeApiFactory('my.api1');
    surface.add(factory1);

    const factory2 = makeApiFactory('my.api2');
    surface.add(factory2);

    expect(surface.apis).toEqual([factory1, factory2]);
  });

  it('should keep the last registered api when the same api is added twice', () => {
    const factory = makeApiFactory('my.api');

    const surface = new ApiSurface();
    surface.add(factory);
    surface.add(factory);

    expect(surface.apis).toEqual([factory]);
  });

  it('should keep the last registered api when two different apis with the same id are added', () => {
    const surface = new ApiSurface();

    const factory1 = makeApiFactory('my.api');
    surface.add(factory1);

    const factory2 = makeApiFactory('my.api', { configApi: configApiRef });
    surface.add(factory2);

    expect(surface.apis).toEqual([factory2]);
  });

  function makeApiFactory(
    id: string,
    dependencies: any | undefined = undefined,
  ) {
    class MyApi {}

    if (dependencies) {
      return createApiFactory({
        api: createApiRef({
          id: id,
        }),
        deps: dependencies,
        factory: jest.fn(),
      });
    }
    return createApiFactory<MyApi, any>(
      createApiRef({
        id: id,
      }),
      null,
    );
  }
});
