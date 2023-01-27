import {
  BackendCatalogSurface,
  BackendPluginInterface,
  PluginEnvironment,
} from '@esback/core';
import {
  defaultGroupTransformer,
  defaultUserTransformer,
  GroupTransformer,
  LdapOrgReaderProcessor,
  UserTransformer,
} from '@backstage/plugin-catalog-backend-module-ldap';

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

  setGroupTransformerBuilder(builder: () => (vendor, config, entry) => void) {
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

export const LdapPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyWithDependency(
    BackendCatalogSurface,
    LdapSurface,
    (catalogSurface, ldapSurface) => {
      catalogSurface.addCatalogProcessorBuilder(env =>
        LdapOrgReaderProcessor.fromConfig(env.config, {
          logger: env.logger,
          groupTransformer: ldapSurface.buildGroupTransformer(env),
          userTransformer: ldapSurface.buildUserTransformer(env),
        }),
      );
    },
  );
};
