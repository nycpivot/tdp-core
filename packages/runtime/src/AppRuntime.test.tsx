import React from 'react';
import {
  ApiSurface,
  AppRouteSurface,
  SidebarItemSurface,
  TpbPluginInterface,
} from '@tpb/core';
import { AppRuntime } from './AppRuntime';
import {
  ApiRef,
  appThemeApiRef,
  configApiRef,
  createApiFactory,
  identityApiRef,
} from '@backstage/core-plugin-api';

describe('AppRuntime', () => {
  it('should apply default plugins (catalog, techdocs, search, api)', () => {
    const runtime = new AppRuntime();

    const sidebarItemSurface = runtime.surfaces.findSurface(SidebarItemSurface);
    const routeSurface = runtime.surfaces.findSurface(AppRouteSurface);
    expect(sidebarItemSurface.mainItems).toHaveLength(3);
    expect(routeSurface.nonDefaultRoutes).toHaveLength(8);
  });

  it('should add default plugins (catalog, techdocs, api) to provided plugin list', () => {
    const fakePlugin: TpbPluginInterface = context =>
      context.applyTo(SidebarItemSurface, surface =>
        surface.addMainItem(<>Fake Item</>),
      );

    const runtime = new AppRuntime([fakePlugin]);
    expect(
      runtime.surfaces.findSurface(SidebarItemSurface).mainItems,
    ).toHaveLength(4);
  });

  describe('api surface', () => {
    it('should not contain config api', () => {
      const runtime = new AppRuntime([createPluginWithApi(configApiRef)]);
      expect(
        runtime.surfaces
          .findSurface(ApiSurface)
          .apis.filter(api => api.api.id === configApiRef.id),
      ).toHaveLength(0);
    });

    it('should not contain identity api', () => {
      const runtime = new AppRuntime([createPluginWithApi(identityApiRef)]);
      expect(
        runtime.surfaces
          .findSurface(ApiSurface)
          .apis.filter(api => api.api.id === identityApiRef.id),
      ).toHaveLength(0);
    });

    it('should not contain theme api', () => {
      const runtime = new AppRuntime([createPluginWithApi(appThemeApiRef)]);
      expect(
        runtime.surfaces
          .findSurface(ApiSurface)
          .apis.filter(api => api.api.id === appThemeApiRef.id),
      ).toHaveLength(0);
    });

    function createPluginWithApi(apiRef: ApiRef<any>): TpbPluginInterface {
      return context =>
        context.applyTo(ApiSurface, surface =>
          surface.add(
            createApiFactory({
              api: apiRef,
              deps: {},
              factory: jest.fn(),
            }),
          ),
        );
    }
  });
});
