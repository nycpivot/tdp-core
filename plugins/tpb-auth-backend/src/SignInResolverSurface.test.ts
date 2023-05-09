import { SignInResolverSurface } from './SignInResolverSurface';
import { AuthResolverContext } from '@backstage/plugin-auth-backend';

describe('SignInResolverSurface', () => {
  const testResolver = (_: any, ctx: AuthResolverContext) => {
    const userRef = 'user:default/guest';
    return ctx.issueToken({
      claims: {
        sub: userRef,
        ent: [userRef],
      },
    });
  };

  it('returns a SignInAsGuestResolver if no resolver exists for an authProvider', () => {
    const surface = new SignInResolverSurface();

    expect(surface.getResolver('doesntExist').prototype).toEqual(
      surface.signInAsGuestResolver().prototype,
    );
  });

  it('allows setting/getting a resolver for an authProviderKey', () => {
    const surface = new SignInResolverSurface();

    surface.add('test', testResolver);
    expect(surface.getResolver('test')).toEqual(testResolver);
  });

  it('outputs a warning when multiple resolvers are set for an authProviderKey', () => {
    const consoleOutput: string[] = [];

    const originalWarn = console.warn;
    const mockedWarn = (warning: string) => consoleOutput.push(warning);
    console.warn = mockedWarn;

    const surface = new SignInResolverSurface();
    surface.add('test', testResolver);
    surface.add('test', testResolver);

    expect(consoleOutput.length).toEqual(1);
    expect(consoleOutput[0]).toEqual(
      'Multiple SignInResolvers are set for test, this can cause unexpected behavior.',
    );
    console.warn = originalWarn;
  });
});
