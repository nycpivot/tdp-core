import {
  ApiRef,
  createApiFactory,
  createApiRef,
} from '@backstage/core-plugin-api';
import { ApiDeduplicator } from './ApiDeduplicator';

describe('Api Deduplicator', () => {
  it('should remove duplicates', () => {
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
    const finder = new ApiDeduplicator(apis);
    const deduplicates = finder.deduplicate([
      createApiFactory<MyApi, any>(
        createApiRef({
          id: 'my.api2',
        }),
        null,
      ),
      createApiFactory<MyApi, any>(
        createApiRef({
          id: 'keep.it',
        }),
        null,
      ),
    ]);

    expect(deduplicates).toHaveLength(1);
    expect(deduplicates.map(f => f.api.id)).toEqual(['keep.it']);
  });
});
