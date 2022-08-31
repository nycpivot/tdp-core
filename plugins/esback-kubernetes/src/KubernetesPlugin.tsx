import React from 'react'
import { AppPluginInterface } from "@esback/core"
import { EntityLayout } from "@backstage/plugin-catalog"
import { EntityKubernetesContent } from "@backstage/plugin-kubernetes"

export const KubernetesPlugin: AppPluginInterface = () => ({
  entityPage: (surface) => {
    surface.addServicePageTab(
      <EntityLayout.Route path="/kubernetes" title="Kubernetes">
        <EntityKubernetesContent refreshIntervalMs={30000} />
      </EntityLayout.Route>
    )
  }
})