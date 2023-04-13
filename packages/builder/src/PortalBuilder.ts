import { PortalConfiguration } from './PortalConfiguration';
import { FileContent, FilePath, PathResolver } from './FileContent';
import { registryConfiguration } from './Registry';
import { HandlebarTemplate } from './Templates';

export type Portal = {
  filesToCopy: { from: string; to: string }[];
  fileContents: FileContent[];
};

export class PortalBuilder {
  private readonly _config: PortalConfiguration;
  private readonly _resolvePath: PathResolver;

  constructor(config: PortalConfiguration, resolvePath: PathResolver) {
    this._config = config;
    this._resolvePath = resolvePath;
  }

  build(): Portal {
    return {
      filesToCopy: this.filesToCopy(),
      fileContents: this.fileContents(),
    };
  }

  private fileContents() {
    return [
      registryConfiguration(
        this._config.registry,
        this._config.assetsFolder,
        this._resolvePath,
      ),
      ...this.fileContentsFromTemplates(),
    ];
  }

  private filesToCopy() {
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

  fileContentsFromTemplates(): FileContent[] {
    const assetsFolder = this._config.assetsFolder;
    const data = [
      {
        template: `${assetsFolder}/packages/app/src/index.ts.hbs`,
        output: 'packages/app/src/index.ts',
      },
      {
        template: `${assetsFolder}/packages/app/package.json.hbs`,
        output: 'packages/app/package.json',
      },
      {
        template: `${assetsFolder}/packages/backend/src/index.ts.hbs`,
        output: 'packages/backend/src/index.ts',
      },
      {
        template: `${assetsFolder}/packages/backend/package.json.hbs`,
        output: 'packages/backend/package.json',
      },
    ];

    return data.map(d => this.fileContentFromTemplate(d));
  }

  private fileContentFromTemplate(data: {
    template: FilePath;
    output: FilePath;
  }) {
    return new HandlebarTemplate(
      data.template,
      this._resolvePath,
    ).createFileContent(data.output, this._config.pluginsConfig.resolve());
  }
}
