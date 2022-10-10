import React from 'react'
import { AppPluginExport } from "@esback/core";
import { AppRuntime } from "./AppRuntime";

describe('AppRuntime', () => {
  it('should apply catalog by default', () => {
    const runtime = new AppRuntime()

    const { sidebarItemSurface, routeSurface } = runtime.surfaces
    expect(sidebarItemSurface.all).toHaveLength(1)
    expect(routeSurface.defaultRoute).toBe('catalog')
    expect(routeSurface.nonDefaultRoutes).toHaveLength(4)
  })

  it('should add catalog plugin to provided plugin list', () => {
    const fakePlugin: AppPluginExport = {
      sidebarItems: (surface) => surface.add(<></>)
    }

    const runtime = new AppRuntime([fakePlugin])
    expect(runtime.surfaces.sidebarItemSurface.all).toHaveLength(2)
  })

  it('should apply changes to entityPage surface first', () => {
    const fakePlugin1: AppPluginExport = {
      routes: (surface, ctx) => {
        if (ctx.entityPageSurface.apiPageTabs.length === 0) {
          fail('entityPage should have been applied before routes')
        }
        
        surface.add(<>Fake route</>)
      }
    }
    const fakePlugin2: AppPluginExport = {
      entityPage: (surface) => {
        surface.addApiPageTab(<>Fake tab</>)
      }
    }

    const runtime = new AppRuntime([fakePlugin1, fakePlugin2])

    const { entityPageSurface, routeSurface } = runtime.surfaces
    expect(entityPageSurface.apiPageTabs).toHaveLength(1)
    expect(routeSurface.nonDefaultRoutes).toHaveLength(5)
  })

  it('should allow plugins to change default route', () => {
    const fakePlugin: AppPluginExport = {
      routes: (surface) => surface.setDefault('test')
    }

    const runtime = new AppRuntime([ fakePlugin ])
    expect(runtime.surfaces.routeSurface.defaultRoute).toBe('test')
  })
})