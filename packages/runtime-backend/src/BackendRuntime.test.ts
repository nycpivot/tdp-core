import { BackendPluginSurface } from '@tpb/core-backend';
import { BackendRuntime } from './BackendRuntime';

describe('BackendRuntime', () => {
  it('should add default plugins', () => {
    const { surfaces } = new BackendRuntime();

    expect(surfaces.findSurface(BackendPluginSurface).plugins).toHaveLength(5);
  });

  it('should set main app', () => {
    const { surfaces } = new BackendRuntime();

    expect(surfaces.findSurface(BackendPluginSurface).mainApp).toBeDefined();
  });
});
