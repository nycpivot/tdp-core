import { BackendPluginInterface } from '@tpb/core-backend';
import { AuthResolverContext, providers } from '@backstage/plugin-auth-backend';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';
import { SignInProviderSurface } from '@tpb/plugin-auth-backend';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { NotFoundError } from '@backstage/errors';

const userRef = ['user-a', 'user-b', 'user-c', 'user-d'];
let index = 0;

function rotateUser() {
  index = (index + 1) % userRef.length;
}

const signInWithRevolvingUserRef = async (
  context: AuthResolverContext,
): Promise<BackstageSignInResult> => {
  const name = userRef[index];
  rotateUser();
  const userEntityRef = stringifyEntityRef({
    kind: 'User',
    name: name,
  });
  try {
    // we await here so that signInWithName throws in the current `try`
    return await context.signInWithCatalogUser({
      entityRef: userEntityRef,
    });
  } catch (e) {
    if (!(e instanceof NotFoundError)) {
      throw e;
    }
    return context.issueToken({
      claims: {
        sub: userEntityRef,
        ent: [userEntityRef],
      },
    });
  }
};

export const PermissionTestAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyTo(SignInProviderSurface, signInProviderSurface => {
      signInProviderSurface.add({
        'permission-test': providers.google.create({
          signIn: {
            resolver: async (_, context): Promise<BackstageSignInResult> =>
              signInWithRevolvingUserRef(context),
          },
        }),
      });
    });
  };
