import React from 'react'
import { Route } from 'react-router'
import { SidebarItem } from '@backstage/core-components'
import { AppPluginInterface, RoutableConfig } from "@tanzu/backstage-core"
import { GraphiQLPage, GraphiQLIcon } from '@backstage/plugin-graphiql'

export const GraphiQLPlugin: AppPluginInterface<RoutableConfig> = (config) => {
  const { path, label }: RoutableConfig = {
    path: "graphiql",
    label: "GraphiQL",
    ...config
  }

  return {
    routes: (surface) => {
      surface.add(
        <Route path={`/${path}`} element={<GraphiQLPage />} />
      )
    },
    sidebarItems: (surface) => {
      surface.add(
        <SidebarItem icon={GraphiQLIcon} to={path} text={label} />
      )
    }
  }
}