import {
  AnyApiFactory,
  createApiFactory,
  createApiRef,
} from '@backstage/core-plugin-api';
import { ApiDuplicatesFinder } from './ApiDuplicatesFinder';

describe('Api Duplicates Finder', () => {
  it('should detect duplicate', () => {
    class MyApi {}

    const existing: AnyApiFactory[] = [
      createApiFactory<MyApi, any>(
        createApiRef({
          id: 'my.api1',
        }),
        null,
      ),
      createApiFactory<MyApi, any>(
        createApiRef({
          id: 'my.api2',
        }),
        null,
      ),
      createApiFactory<MyApi, any>(
        createApiRef({
          id: 'my.api3',
        }),
        null,
      ),
    ];
    const finder = new ApiDuplicatesFinder(existing);

    expect(
      finder.isDuplicate(
        createApiFactory<MyApi, any>(
          createApiRef({
            id: 'my.api2',
          }),
          null,
        ),
      ),
    ).toBeTruthy();
    expect(
      finder.isDuplicate(
        createApiFactory<MyApi, any>(
          createApiRef({
            id: 'not.found',
          }),
          null,
        ),
      ),
    ).toBeFalsy();
  });
});
