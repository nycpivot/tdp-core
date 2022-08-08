import React from 'react'
import { AppPluginInterface } from "@internal/plugin-plugin-interface";
import { EntityLayout } from "@backstage/plugin-catalog"
import { EntityKubernetesContent } from "@backstage/plugin-kubernetes"

export const ESBackAppPluginIntegration: AppPluginInterface = (context) => {
    context.entityPageSurface.addServicePageTab(
        <EntityLayout.Route path="/kubernetes" title="Kubernetes">
            <EntityKubernetesContent refreshIntervalMs={30000} />
        </EntityLayout.Route>
    )
}