import {
  ApiRef,
  createApiFactory,
  createApiRef,
} from '@backstage/core-plugin-api';
import { ApiDuplicatesFinder } from './ApiDuplicatesFinder';

describe('Api Duplicates Finder', () => {
  it('should detect duplicate', () => {
    class MyApi {}

    const apis: ApiRef<any>[] = [
      createApiRef({
        id: 'my.api1',
      }),
      createApiRef({
        id: 'my.api2',
      }),
      createApiRef({
        id: 'my.api3',
      }),
    ];
    const finder = new ApiDuplicatesFinder(apis);

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
