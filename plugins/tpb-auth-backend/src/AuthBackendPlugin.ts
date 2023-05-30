import {
  BackendPluginInterface,
  BackendPluginSurface,
  PluginEnvironment,
} from '@tpb/core-backend';
import { Router } from 'express';
import { SignInProviderSurface } from './SignInProviderSurface';
import {
  createRouter,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';

const createPlugin = (signInProviderSurface: SignInProviderSurface) => {
  return async (env: PluginEnvironment): Promise<Router> => {
    return await createRouter({
      logger: env.logger,
      config: env.config,
      database: env.database,
      discovery: env.discovery,
      tokenManager: env.tokenManager,
      providerFactories: {
        ...defaultAuthProviderFactories,

        // This replaces the default GitHub auth provider with a customized one.
        // The `signIn` option enables sign-in for this provider, using the
        // identity resolution logic that's provided in the `resolver` callback.
        //
        // This particular resolver makes all users share a single "guest" identity.
        // It should only be used for testing and trying out Backstage.
        //
        // If you want to use a production ready resolver you can switch to the
        // the one that is commented out below, it looks up a user entity in the
        // catalog using the GitHub username of the authenticated user.
        // That resolver requires you to have user entities populated in the catalog,
        // for example using https://backstage.io/docs/integrations/github/org
        //
        // There are other resolvers to choose from, and you can also create
        // your own, see the auth documentation for more details:
        //
        //   https://backstage.io/docs/auth/identity-resolver
        ...signInProviderSurface.allSignInProviders(),
      },
    });
  };
};

export const AuthBackendPlugin: BackendPluginInterface = () => surfaces =>
  surfaces.applyWithDependency(
    BackendPluginSurface,
    SignInProviderSurface,
    (backendPluginSurface, signInProviderSurface) => {
      backendPluginSurface.addPlugin({
        name: 'auth',
        pluginFn: createPlugin(signInProviderSurface),
      });
    },
  );
