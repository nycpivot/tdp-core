import { AppBuilder, AppSurfaces } from '@internal/plugin-app-builder';
import { CatalogPlugin } from '@internal/plugin-esback-catalog';

// Setup
const surfaces: AppSurfaces = new AppSurfaces()
CatalogPlugin(surfaces)
surfaces.routeSurface.setDefault("catalog")
const App = AppBuilder(surfaces)

export default App;
