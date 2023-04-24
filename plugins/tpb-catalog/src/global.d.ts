import { Entity, EntityLink } from '@backstage/catalog-model';
// eslint-disable-next-line @backstage/no-undeclared-imports
import { JsonObject } from '@backstage/types';

declare global {
  function buildTestEntity(
    kind: string,
    spec: JsonObject = {},
    metdata: JsonObject = {},
  ): Entity;
}
