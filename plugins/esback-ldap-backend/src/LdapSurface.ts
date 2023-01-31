import {
  defaultGroupTransformer,
  defaultUserTransformer,
  GroupTransformer,
  UserTransformer,
} from '@backstage/plugin-catalog-backend-module-ldap';
import { PluginEnvironment } from '@esback/core';

export type GroupTransformerBuilder = (
  env: PluginEnvironment,
) => GroupTransformer;

export type UserTransformerBuilder = (
  env: PluginEnvironment,
) => UserTransformer;

export class LdapSurface {
  private _groupTransformerBuilder: GroupTransformerBuilder;
  private _userTransformerBuilder: UserTransformerBuilder;

  constructor() {
    this._groupTransformerBuilder = () => defaultGroupTransformer;
    this._userTransformerBuilder = () => defaultUserTransformer;
  }

  setGroupTransformerBuilder(builder: GroupTransformerBuilder) {
    this._groupTransformerBuilder = builder;
  }

  setUserTransformerBuilder(builder: UserTransformerBuilder) {
    this._userTransformerBuilder = builder;
  }

  buildGroupTransformer(env: PluginEnvironment): GroupTransformer {
    return this._groupTransformerBuilder(env);
  }

  buildUserTransformer(env: PluginEnvironment): UserTransformer {
    return this._userTransformerBuilder(env);
  }
}
