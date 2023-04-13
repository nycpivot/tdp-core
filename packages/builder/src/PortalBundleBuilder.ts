import { PortalConfiguration } from './PortalConfiguration';
import {
  FileContent,
  FileCopy,
  PathResolver,
  readContent,
} from './FileContent';
import { registryConfiguration } from './Registry';
import { HandlebarTemplate } from './HandlebarTemplate';
import { flattenCopies, flattenTemplates } from './BundleStructure';

type CopyBundle = FileCopy[];
type ContentBundle = FileContent[];

export type PortalBundle = {
  copyBundle: CopyBundle;
  contentBundle: ContentBundle;
};

export class PortalBundleBuilder {
  private readonly _config: PortalConfiguration;
  private readonly _resolvePath: PathResolver;

  constructor(config: PortalConfiguration, resolvePath: PathResolver) {
    this._config = config;
    this._resolvePath = resolvePath;
  }

  build(): PortalBundle {
    return {
      copyBundle: this.copyBundle(),
      contentBundle: this.contentBundle(),
    };
  }

  private copyBundle(): CopyBundle {
    return [
      ...flattenCopies(this._config.structure, this._resolvePath),
      {
        from: this._config.appConfig,
        to: 'app-config.yaml',
      },
    ];
  }

  private contentBundle(): ContentBundle {
    return [
      {
        file: '.yarnrc',
        content: readContent(
          this._resolvePath(registryConfiguration(this._config.registry)),
        ),
      },
      ...this.contentBundleFromTemplates(),
    ];
  }

  private contentBundleFromTemplates(): ContentBundle {
    return flattenTemplates(this._config.structure, this._resolvePath).map(d =>
      new HandlebarTemplate(d.template).createFileContent(
        d.file,
        this._config.pluginsResolver,
      ),
    );
  }
}
