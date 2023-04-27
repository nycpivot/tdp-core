import { ApiSurface, AppPluginInterface } from '@tpb/core';
import {
  ScmAuth,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { configApiRef, createApiFactory } from '@backstage/core-plugin-api';

export const ScmPlugin: AppPluginInterface = () => context => {
  context.applyTo(ApiSurface, surface => {
    surface.add(
      createApiFactory({
        api: scmIntegrationsApiRef,
        deps: { configApi: configApiRef },
        factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
      }),
    );

    surface.add(ScmAuth.createDefaultApiFactory());
  });
};
