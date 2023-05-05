import { PermissionPolicy } from '@backstage/plugin-permission-node';
import { OwnedByPermissionPolicy } from './OwnedByPermissionPolicy';
import { Config } from '@backstage/config';

export class PermissionPolicySurface {
  private _permissionPolicy: PermissionPolicy | undefined;

  public set(permissionPolicy: PermissionPolicy) {
    if (this._permissionPolicy !== undefined) {
      throw new Error(
        `Permission policy has already been set to ${this._permissionPolicy.constructor.name}`,
      );
    }
    this._permissionPolicy = permissionPolicy;
  }

  public getPermissionPolicy(config: Config) {
    return this._permissionPolicy || new OwnedByPermissionPolicy(config);
  }
}
