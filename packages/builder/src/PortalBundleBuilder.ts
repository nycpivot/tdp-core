import { PortalConfiguration } from './PortalConfiguration';
import {
  FileContent,
  FileCopy,
  PathResolver,
  readContent,
} from './FileContent';
import { registryConfiguration } from './Registry';
import { HandlebarTemplate } from './HandlebarTemplate';
import { flatten } from './BundleStructure';

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
      {
        from: '../app/.eslintrc.js',
        to: 'packages/app/.eslintrc.js',
      },
      {
        from: '../backend/.eslintrc.js',
        to: 'packages/backend/.eslintrc.js',
      },
      {
        from: '../app/public',
        to: 'packages/app/public',
      },
      {
        from: '../../package.json',
        to: 'package.json',
      },
      {
        from: '../../tsconfig.json',
        to: 'tsconfig.json',
      },
      {
        from: '../../backstage.json',
        to: 'backstage.json',
      },
      {
        from: this._config.appConfig,
        to: 'app-config.yaml',
      },
    ].map(item => ({
      from: this._resolvePath(item.from),
      to: item.to,
    }));
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
    return flatten(this._config.structure).map(d =>
      new HandlebarTemplate(d.template, this._resolvePath).createFileContent(
        d.file,
        this._config.pluginsResolver,
      ),
    );
  }
}
