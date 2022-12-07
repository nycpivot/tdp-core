import { BackendPluginSurface } from '@esback/core';
import { BackendRuntime } from './BackendRuntime';

describe('BackendRuntime', () => {
  it('should add default plugins', () => {
    const { surfaces } = new BackendRuntime();

    expect(surfaces.getSurfaceState(BackendPluginSurface).plugins).toHaveLength(
      5,
    );
  });

  it('should set main app', () => {
    const { surfaces } = new BackendRuntime();

    expect(
      surfaces.getSurfaceState(BackendPluginSurface).mainApp,
    ).toBeDefined();
  });
});
