import { BackendPluginInterface } from '@esback/core';
import { LdapSurface } from '@esback/plugin-ldap-backend';
import {
  defaultGroupTransformer,
  defaultUserTransformer,
} from '@backstage/plugin-catalog-backend-module-ldap';

export const LdapTransformersPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(LdapSurface, surface => {
      surface.setGroupTransformerBuilder(() => {
        return async (vendor, config, entry) => {
          const entity = await defaultGroupTransformer(vendor, config, entry);
          if (entity) {
            entity.metadata.description =
              'Description added by custom group transformer !';
          }
          return entity;
        };
      });

      surface.setUserTransformerBuilder(() => {
        return async (vendor, config, entry) => {
          const entity = await defaultUserTransformer(vendor, config, entry);
          if (entity) {
            entity.metadata.description =
              'Description added by custom user transformer !';
          }
          return entity;
        };
      });
    });
  };
