import React from 'react'
import { Route } from 'react-router'
import { SidebarItem } from '@backstage/core-components'
import { AppPluginInterface } from "@esback/core"
import { TechRadarPage } from '@backstage/plugin-tech-radar'
import MapIcon from '@material-ui/icons/MyLocation';

export const TechRadarPlugin: AppPluginInterface = (ctx) => {
  ctx.routeSurface.add(
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
  );

  ctx.sidebarItemSurface.add(
    <SidebarItem icon={MapIcon} to="tech-radar" text="TechRadar" />
  )
}