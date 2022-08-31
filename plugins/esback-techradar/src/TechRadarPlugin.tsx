import React from 'react'
import { Route } from 'react-router'
import { SidebarItem } from '@backstage/core-components'
import { AppPluginInterface, RoutableConfig } from "@esback/core"
import { TechRadarPage } from '@backstage/plugin-tech-radar'
import MapIcon from '@material-ui/icons/MyLocation';

export const TechRadarPlugin: AppPluginInterface<RoutableConfig> = (config) => {
  const { path, label }: RoutableConfig = {
    path: 'tech-radar',
    label: 'TechRadar',
    ...config
  }

  return {
    routes: (surface) => surface.add(
      <Route
        path={`/${path}`}
        element={<TechRadarPage width={1500} height={800} />}
      />
    ),
    sidebarItems: (surface) => surface.add(<SidebarItem icon={MapIcon} to={path} text={label} />)
  }
}