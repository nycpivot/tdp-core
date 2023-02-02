import {
  GroupTransformer,
  OrganizationTransformer,
  UserTransformer,
} from '@backstage/plugin-catalog-backend-module-msgraph';

export class MicrosoftGraphOrgReaderProcessorTransformersSurface {
  private _userTransformer?: UserTransformer;
  private _groupTransformer?: GroupTransformer;
  private _organizationTransformer?: OrganizationTransformer;

  public userTransformer(): UserTransformer | undefined {
    return this._userTransformer;
  }

  public setUserTransformer(userTransformer: UserTransformer) {
    this._userTransformer = userTransformer;
  }

  public groupTransformer(): GroupTransformer | undefined {
    return this._groupTransformer;
  }

  public setGroupTransformer(groupTransformer: GroupTransformer) {
    this._groupTransformer = groupTransformer;
  }

  public organizationTransformer(): OrganizationTransformer | undefined {
    return this._organizationTransformer;
  }

  public setOrganizationTransformer(
    organizationTransformer: OrganizationTransformer,
  ) {
    this._organizationTransformer = organizationTransformer;
  }
}
