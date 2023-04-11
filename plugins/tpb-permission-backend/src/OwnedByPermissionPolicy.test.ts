import { OwnedByPermissionPolicy } from './OwnedByPermissionPolicy';
import { ConfigReader } from '@backstage/config';
import {
  AnyOfCriteria,
  AuthorizeResult,
  ConditionalPolicyDecision,
  createPermission,
  PermissionAttributes,
  PermissionCondition,
} from '@backstage/plugin-permission-common';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common/alpha';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import { PolicyQuery } from '@backstage/plugin-permission-node';
import { catalogConditions } from '@backstage/plugin-catalog-backend/alpha';
import { catalogAnnotationContains } from './CatalogAnnotationContainsRule';

const getCatalogPolicyQuery = (
  attribute: PermissionAttributes,
): PolicyQuery => ({
  permission: createPermission({
    name: 'test-permission',
    attributes: attribute,
    resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
  }),
});
const getNonCatalogPolicyQuery = (
  attribute: PermissionAttributes,
): PolicyQuery => ({
  permission: createPermission({
    name: 'test-permission',
    attributes: attribute,
  }),
});
const getUserWithOwnershipEntityRefs = (
  refs: string[],
): BackstageIdentityResponse => ({
  token: 'token',
  identity: {
    type: 'user',
    userEntityRef: 'user:default/test-user',
    ownershipEntityRefs: refs,
  },
});
const fullAccess: PermissionAttributes[] = [
  { action: 'create' },
  { action: 'delete' },
  { action: 'update' },
  { action: 'read' },
  { action: undefined },
];
describe('OwnedByPermissionPolicy', () => {
  describe('Without admin list configured', () => {
    const permissionPolicy = new OwnedByPermissionPolicy(new ConfigReader({}));

    it('allows full access on non catalog resources', async () => {
      for (const access of fullAccess) {
        const decision = await permissionPolicy.handle(
          getNonCatalogPolicyQuery(access),
        );
        expect(decision.result).toEqual(AuthorizeResult.ALLOW);
      }
    });

    it('creates catalog condition decision for catalog resources', async () => {
      const ownershipEntityRefs = [
        'user:default/user-a.b_c',
        `group:some-group.namespace_here/name`,
      ];
      const user = getUserWithOwnershipEntityRefs(ownershipEntityRefs);
      const request = getCatalogPolicyQuery({ action: 'read' });
      const policyDecision = await permissionPolicy.handle(request, user);

      expect(policyDecision.result).toEqual(AuthorizeResult.CONDITIONAL);
      const conditionalDecision = policyDecision as ConditionalPolicyDecision;
      expect(conditionalDecision.pluginId).toEqual('catalog');
      expect(conditionalDecision.resourceType).toEqual(
        RESOURCE_TYPE_CATALOG_ENTITY,
      );

      const conditions = conditionalDecision.conditions as AnyOfCriteria<
        PermissionCondition<'catalog-entity'>
      >;
      expect(conditions.anyOf).toContainEqual(
        catalogConditions.isEntityOwner({ claims: ownershipEntityRefs }),
      );
      expect(conditions.anyOf).toContainEqual(
        catalogAnnotationContains({
          annotation: 'backstage.tanzu.vmware.com/user.default.user-a.b_c',
          value: request.permission.name,
        }),
      );
      expect(conditions.anyOf).toContainEqual(
        catalogAnnotationContains({
          annotation:
            'backstage.tanzu.vmware.com/group.some-group.namespace_here.name',
          value: request.permission.name,
        }),
      );
    });
  });

  describe('With admin list configured', () => {
    const admins = {
      adminUser: 'user:default/admin-user',
      adminGroup: 'group:another/admin-group',
    };
    const permissionPolicy = new OwnedByPermissionPolicy(
      new ConfigReader({
        permission: {
          adminRefs: [admins.adminUser, admins.adminGroup],
        },
      }),
    );

    for (const [key, value] of Object.entries(admins)) {
      describe(`For ${key}`, () => {
        it('has permission to all catalog resource actions', async () => {
          for (const access of fullAccess) {
            const decision = await permissionPolicy.handle(
              getCatalogPolicyQuery(access),
              getUserWithOwnershipEntityRefs([
                value,
                'group:default/other-group',
              ]),
            );
            expect(decision.result).toEqual(AuthorizeResult.ALLOW);
          }
        });
      });
    }
  });
});
