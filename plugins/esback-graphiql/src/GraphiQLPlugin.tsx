import React from 'react'
import { Route } from 'react-router'
import { SidebarItem } from '@backstage/core-components'
import { AppPluginInterface } from "@esback/core"
import { GraphiQLPage, GraphiQLIcon } from '@backstage/plugin-graphiql'

export const GraphiQLPlugin: AppPluginInterface = (ctx) => {
    ctx.routeSurface.add(
        <Route path="/graphiql" element={<GraphiQLPage />} />
    );

    ctx.sidebarItemSurface.add(
        <SidebarItem icon={GraphiQLIcon} to="graphiql" text="GraphiQL" />
    )
}