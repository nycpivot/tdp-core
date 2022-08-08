import { AppSurfaces } from "@internal/plugin-app-builder";
import { BackendSurfaces } from "@internal/plugin-esback-builder-backend";

export type AppPluginInterface = (context: AppSurfaces) => void
export type BackendPluginInterface = (context: BackendSurfaces) => void
