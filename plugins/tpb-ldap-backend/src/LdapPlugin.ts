import {
  BackendCatalogSurface,
  BackendPluginInterface,
} from '@tpb/core-backend';
import { LdapOrgReaderProcessor } from '@backstage/plugin-catalog-backend-module-ldap';
import { LdapSurface } from './LdapSurface';

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
