import { createConditionFactory } from '@backstage/plugin-permission-node';
import { createCatalogPermissionRule } from '@backstage/plugin-catalog-backend/alpha';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common/alpha';
import { z } from 'zod';

export const catalogAnnotationContainsRule = createCatalogPermissionRule({
  name: 'ANNOTATION_CONTAINS',
  description: 'Allow entities with the specified annotation',
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
  paramsSchema: z.object({
    annotation: z.string().describe('Name of the annotation to match on'),
    value: z.string().describe('Value that the annotation should contain'),
  }),
  apply: (resource, { annotation, value }) => {
    return (
      !!resource.metadata.annotations?.hasOwnProperty(annotation) &&
      value !== '' &&
      resource.metadata.annotations[annotation]
        .split(',')
        .map(i => i.trim())
        .includes(value)
    );
  },
  toQuery: ({ annotation }) => ({
    key: `metadata.annotations.${annotation}`,
  }),
});

export const catalogAnnotationContains = createConditionFactory(
  catalogAnnotationContainsRule,
);
