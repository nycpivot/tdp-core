import {
  appThemeApiRef,
  configApiRef,
  createApiFactory,
  createApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { ApiDeduplicator } from './ApiDeduplicator';

describe('Api Deduplicator', () => {
  it('should ignore duplicates', () => {
    class MyApi {}
    const finder = new ApiDeduplicator();

    const deduplicates = finder.ignoreDuplicates([
      createApiFactory<MyApi, any>(appThemeApiRef, null),
      createApiFactory<MyApi, any>(
        createApiRef({
          id: 'keep.it',
        }),
        null,
      ),
      createApiFactory<MyApi, any>(configApiRef, null),
      createApiFactory<MyApi, any>(identityApiRef, null),
    ]);

    expect(deduplicates).toHaveLength(1);
    expect(deduplicates.map(f => f.api.id)).toEqual(['keep.it']);
  });
});
