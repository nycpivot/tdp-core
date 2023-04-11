import {
  PermissionPolicy,
  PolicyQuery,
} from '@backstage/plugin-permission-node';
import {
  catalogConditions,
  createCatalogConditionalDecision,
} from '@backstage/plugin-catalog-backend/alpha';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common/alpha';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import {
  AuthorizeResult,
  isResourcePermission,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import { Config } from '@backstage/config';
import { catalogAnnotationContains } from './CatalogAnnotationContainsRule';

export class OwnedByPermissionPolicy implements PermissionPolicy {
  private _adminRefs: String[];

  constructor(config: Config) {
    this._adminRefs =
      config.getOptionalStringArray('permission.adminRefs') || [];
  }

  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    const ownershipEntityRefs = user?.identity.ownershipEntityRefs ?? [];
    if (
      isResourcePermission(request.permission, RESOURCE_TYPE_CATALOG_ENTITY)
    ) {
      if (ownershipEntityRefs.some(r => this._adminRefs.includes(r))) {
        return { result: AuthorizeResult.ALLOW };
      }

      return createCatalogConditionalDecision(request.permission, {
        anyOf: [
          catalogConditions.isEntityOwner({ claims: ownershipEntityRefs }),
          ...ownershipEntityRefs.map(oer => {
            const sanitizedOer = oer.replace(':', '.').replace('/', '.');
            return catalogAnnotationContains({
              annotation: `backstage.tanzu.vmware.com/${sanitizedOer}`,
              value: request.permission.name,
            });
          }),
        ],
      });
    }
    return { result: AuthorizeResult.ALLOW };
  }
}
