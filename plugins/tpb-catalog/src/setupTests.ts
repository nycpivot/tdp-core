import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';
import { JsonObject } from '@backstage/types';
import { Entity } from '@backstage/catalog-model';

global.buildTestEntity = (
  kind: string,
  spec: JsonObject = {},
  metadata: JsonObject = {},
): Entity => ({
  apiVersion: 'v1',
  kind,
  metadata: {
    name: 'TestEntity',
    description: 'This is the description',
    ...metadata,
  },
  spec: {
    owner: 'guest',
    ...spec,
  },
  relations: [
    {
      type: 'ownedBy',
      targetRef: 'user:default/guest',
    },
  ],
});
