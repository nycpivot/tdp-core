import { PluginSurface } from './PluginSurface';
import { PluginEnvironment } from './PluginEnvironment';
import { CatalogProcessorSurface } from './CatalogProcessorSurface';

export class BackendSurfaces {
  private readonly _catalogProcessorSurface: CatalogProcessorSurface;
  private readonly _pluginSurface: PluginSurface<PluginEnvironment>;

  public constructor() {
    this._catalogProcessorSurface = new CatalogProcessorSurface();
    this._pluginSurface = new PluginSurface();
  }

  public get catalogProcessorSurface(): CatalogProcessorSurface {
    return this._catalogProcessorSurface;
  }

  public get pluginSurface(): PluginSurface<PluginEnvironment> {
    return this._pluginSurface;
  }
}
