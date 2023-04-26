import { ApiSurface } from './ApiSurface';
import {
  ApiRef,
  createApiFactory,
  createApiRef,
} from '@backstage/core-plugin-api';

describe('Api Surface', () => {
  it('should register apis', () => {
    class MyApi {}

    const surface = new ApiSurface();

    surface.add(
      createApiFactory<MyApi, any>(
        createApiRef({
          id: 'my.api1',
        }),
        null,
      ),
    );

    surface.add(
      createApiFactory<MyApi, any>(
        createApiRef({
          id: 'my.api2',
        }),
        null,
      ),
    );

    expect(surface.apis).toHaveLength(2);
    expect(surface.apis.map(a => a.api.id)).toEqual(['my.api1', 'my.api2']);
  });

  it('should keep the last registered api when the same api is added twice', () => {
    class MyApi {}

    const surface = new ApiSurface();

    const ref: ApiRef<MyApi> = createApiRef({
      id: 'my.api',
    });
    const factory = createApiFactory<MyApi, any>(ref, null);

    surface.add(factory);
    surface.add(factory);

    expect(surface.apis.map(a => a.api)).toEqual(['my.api']);
  });
});
