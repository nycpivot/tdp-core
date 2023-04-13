import {PortalConfiguration} from './PortalConfiguration';
import {FileContent, FileCopy, PathResolver, readContent} from './FileContent';
import {registryConfiguration} from './Registry';
import {HandlebarTemplate} from './HandlebarTemplate';

export type PortalBundle = {
  filesToCopy: FileCopy[];
  fileContents: FileContent[];
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
      filesToCopy: this.filesToCopy(),
      fileContents: this.fileContents(),
    };
  }

  private filesToCopy(): FileCopy[] {
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

  private fileContents(): FileContent[] {
    return [
      {
        file: '.yarnrc',
        content: readContent(this._resolvePath(registryConfiguration(this._config.registry))),
      },
      ...this.fileContentsFromTemplates(),
    ];
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

    return data.map(d =>
      new HandlebarTemplate(d.template, this._resolvePath).createFileContent(
        d.output,
        this._config.pluginsResolver,
      ),
    );
  }
}
