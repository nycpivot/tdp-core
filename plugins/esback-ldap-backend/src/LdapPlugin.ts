import { BackendCatalogSurface, BackendPluginInterface } from '@esback/core';
import { LdapOrgReaderProcessor } from '@backstage/plugin-catalog-backend-module-ldap';

export const LdapPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(BackendCatalogSurface, surface => {
    surface.addCatalogProcessorBuilder(env =>
      LdapOrgReaderProcessor.fromConfig(env.config, {
        logger: env.logger,
      }),
    );
  });
};
