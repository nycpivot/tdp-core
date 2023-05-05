import { PermissionPolicySurface } from './PermissionPolicySurface';
import { PermissionPolicy } from '@backstage/plugin-permission-node';
import { ConfigReader } from '@backstage/config';
import { OwnedByPermissionPolicy } from './OwnedByPermissionPolicy';
import { CustomPermissionPolicy } from '@tpb/plugin-permission-test-policy';

describe('PermissionPolicySurface', () => {
  const fakePermissionPolicy: PermissionPolicy = new CustomPermissionPolicy();
  const config = new ConfigReader({ adminRefs: ['test-user'] });

  it('use default owned-by permission policy when policy not set', () => {
    const surface = new PermissionPolicySurface();

    expect(surface.getPermissionPolicy(config)).toBeInstanceOf(
      OwnedByPermissionPolicy,
    );
  });

  it('should allow setting custom policy', () => {
    const surface = new PermissionPolicySurface();
    surface.set(fakePermissionPolicy);

    expect(surface.getPermissionPolicy(config)).toEqual(fakePermissionPolicy);
  });

  it('should not allow permission policy to be set multiple times', () => {
    const surface = new PermissionPolicySurface();
    surface.set(fakePermissionPolicy);

    expect(() => surface.set(fakePermissionPolicy)).toThrow(
      'Permission policy has already been set to CustomPermissionPolicy',
    );
  });
});
