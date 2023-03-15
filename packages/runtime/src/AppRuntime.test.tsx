import React from 'react';
import {
  EsbackPluginInterface,
  AppRouteSurface,
  SidebarItemSurface,
} from '@tpb/core';
import { AppRuntime } from './AppRuntime';

describe('AppRuntime', () => {
  it('should apply default plugins (catalog, techdocs, search, api)', () => {
    const runtime = new AppRuntime();

    const sidebarItemSurface = runtime.surfaces.findSurface(SidebarItemSurface);
    const routeSurface = runtime.surfaces.findSurface(AppRouteSurface);
    expect(sidebarItemSurface.mainItems).toHaveLength(3);
    expect(routeSurface.defaultRoute).toBe('catalog');
    expect(routeSurface.nonDefaultRoutes).toHaveLength(8);
  });

  it('should add default plugins (catalog, techdocs, api) to provided plugin list', () => {
    const fakePlugin: EsbackPluginInterface = context =>
      context.applyTo(SidebarItemSurface, surface =>
        surface.addMainItem(<>Fake Item</>),
      );

    const runtime = new AppRuntime([fakePlugin]);
    expect(
      runtime.surfaces.findSurface(SidebarItemSurface).mainItems,
    ).toHaveLength(4);
  });

  it('should allow plugins to change default route', () => {
    const fakePlugin: EsbackPluginInterface = context =>
      context.applyTo(AppRouteSurface, surface => surface.setDefault('test'));

    const runtime = new AppRuntime([fakePlugin]);
    expect(runtime.surfaces.findSurface(AppRouteSurface).defaultRoute).toBe(
      'test',
    );
  });
});
