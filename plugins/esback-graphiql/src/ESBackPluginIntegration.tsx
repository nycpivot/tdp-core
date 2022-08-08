import React from 'react'
import { Route } from 'react-router'
import { SidebarItem } from '@backstage/core-components'
import { AppSurfaces } from "@internal/plugin-app-builder"
import { AppPluginInterface } from "@internal/plugin-plugin-interface"
import { GraphiQLPage, GraphiQLIcon } from '@backstage/plugin-graphiql'

export const ESBackPluginIntegration: AppPluginInterface = (ctx: AppSurfaces) => {
    ctx.routeSurface.add(
        <Route path="/graphiql" element={<GraphiQLPage />} />
    );

    ctx.sidebarItemSurface.add(
        <SidebarItem icon={GraphiQLIcon} to="graphiql" text="GraphiQL" />
    )
}
