
import { BackendPluginInterface } from "@internal/plugin-plugin-interface";
// import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';

// const kubernetes = async function createPlugin(
//   env: PluginEnvironment,
// ): Promise<Router> {
//   const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
//   const { router } = await KubernetesBuilder.createBuilder({
//     logger: env.logger,
//     config: env.config,
//     catalogApi,
//   }).build();
//   return router;
// }

// TODO Figure out if we can have frontend and backend config in the same library.
// Right now, if the k8s backend library is added dependencies start to break
export const ESBackBackendPluginIntegration: BackendPluginInterface = (context) => {
    //context.pluginSurface.setPlugin("kubernetes", kubernetes)
}