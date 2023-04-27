import { SignInResolverSurface } from './SignInResolverSurface';
import { AuthResolverContext } from '@backstage/plugin-auth-backend';

describe('SignInResolverSurface', () => {
  it('returns a SignInAsGuestResolver if no resolver exists for an authProvider', () => {
    const surface = new SignInResolverSurface();

    expect(surface.getResolver('doesntExist').prototype).toEqual(
      surface.signInAsGuestResolver().prototype,
    );
  });

  it('allows setting/getting a resolver for an authProviderKey', () => {
    const surface = new SignInResolverSurface();

    const resolver = (_: any, ctx: AuthResolverContext) => {
      const userRef = 'user:default/guest';
      return ctx.issueToken({
        claims: {
          sub: userRef,
          ent: [userRef],
        },
      });
    };

    surface.add('test', resolver);
    expect(surface.getResolver('test')).toEqual(resolver);
  });
});
