import { AppSurfaces } from "./app/AppSurfaces";
import { BackendSurfaces } from "./backend";

export type AppPluginInterface = (context: AppSurfaces) => void
export type BackendPluginInterface = (context: BackendSurfaces) => void