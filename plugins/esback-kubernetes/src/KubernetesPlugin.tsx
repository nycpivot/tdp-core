import React from 'react'
import { AppPluginInterface, RoutableConfig } from "@tanzu/backstage-core"
import { EntityLayout } from "@backstage/plugin-catalog"
import { EntityKubernetesContent, EntityKubernetesContentProps } from "@backstage/plugin-kubernetes"

export const KubernetesPlugin: AppPluginInterface<RoutableConfig & EntityKubernetesContentProps> = (config) => ({
  entityPage: (surface) => {
    surface.addServicePageTab(
      <EntityLayout.Route path={`/${config?.path || "kubernetes"}`} title={config?.label || "Kubernetes"}>
        <EntityKubernetesContent refreshIntervalMs={config?.refreshIntervalMs || 30000} />
      </EntityLayout.Route>
    )
  }
})