import { ApiSurface } from './ApiSurface';
import {
  AnyApiFactory,
  createApiFactory,
  createApiRef,
} from '@backstage/core-plugin-api';

describe('Api Surface', () => {
  let surface: ApiSurface;

  beforeEach(() => {
    surface = new ApiSurface();
  });

  it('should register apis', () => {
    const factory1 = makeApiFactory('my.api1');
    surface.add(factory1);

    const factory2 = makeApiFactory('my.api2');
    surface.add(factory2);

    expect(surface.apis).toEqual([factory1, factory2]);
  });

  it('should keep the last registered api when the same api is added twice', () => {
    const factory = makeApiFactory('my.api');

    surface.add(factory);
    surface.add(factory);

    expect(surface.apis).toEqual([factory]);
  });

  it('should keep the last registered api when two different apis with the same id are added', () => {
    const factory1 = makeApiFactory('my.api');
    surface.add(factory1);

    const factory2 = makeApiFactory('my.api', { configApi: { id: 'foo' } });
    surface.add(factory2);

    expect(surface.apis).toEqual([factory2]);
  });

  describe('static apis that are created by backstage', () => {
    it('should ignore api', () => {
      ApiSurface.apisToIgnore = ['foo', 'bar'];
      const factory = makeApiFactory('bar');
      surface.add(makeApiFactory('bar'));
      surface.add(makeApiFactory('baz'));

      expect(surface.apis.map(api => api.api.id)).toEqual(['baz']);
    });
  });

  function makeApiFactory(
    id: string,
    dependencies: any | undefined = undefined,
  ): AnyApiFactory {
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
