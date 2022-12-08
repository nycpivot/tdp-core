import React from 'react';
import {
  EsbackPluginInterface,
  AppRouteSurface,
  SidebarItemSurface,
} from '@esback/core';
import { AppRuntime } from './AppRuntime';

describe('AppRuntime', () => {
  it('should apply default plugins (catalog, techdocs, search, api)', () => {
    const runtime = new AppRuntime();

    const sidebarItemSurface =
      runtime.surfaces.getSurfaceState(SidebarItemSurface);
    const routeSurface = runtime.surfaces.getSurfaceState(AppRouteSurface);
    expect(sidebarItemSurface.all).toHaveLength(3);
    expect(routeSurface.defaultRoute).toBe('catalog');
    expect(routeSurface.nonDefaultRoutes).toHaveLength(8);
  });

  it('should add default plugins (catalog, techdocs, api) to provided plugin list', () => {
    const fakePlugin: EsbackPluginInterface = context =>
      context.applyTo(SidebarItemSurface, surface =>
        surface.add(<>Fake Item</>),
      );

    const runtime = new AppRuntime([fakePlugin]);
    expect(
      runtime.surfaces.getSurfaceState(SidebarItemSurface).all,
    ).toHaveLength(4);
  });

  it('should allow plugins to change default route', () => {
    const fakePlugin: EsbackPluginInterface = context =>
      context.applyTo(AppRouteSurface, surface => surface.setDefault('test'));

    const runtime = new AppRuntime([fakePlugin]);
    expect(runtime.surfaces.getSurfaceState(AppRouteSurface).defaultRoute).toBe(
      'test',
    );
  });
});
