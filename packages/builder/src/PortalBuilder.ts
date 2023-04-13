import { PortalConfiguration } from './PortalConfiguration';
import { FileContent, PathResolver, readContent } from './FileContent';
import { registryConfiguration } from './Registry';
import { PluginsConfiguration } from './PluginsConfiguration';
import { HandlebarGenerator } from './Templates';

export type Portal = {
  filesToCopy: { from: string; to: string }[];
  generatedContents: FileContent[];
};

export class PortalBuilder {
  private _config: PortalConfiguration;
  private readonly _pluginsConfig: PluginsConfiguration;

  constructor(config: PortalConfiguration) {
    this._config = config;
    this._pluginsConfig = config.pluginsConfig;
  }

  build(resolvePath: PathResolver): Portal {
    return {
      filesToCopy: this.filesToCopy(resolvePath),
      generatedContents: this.generate(resolvePath),
    };
  }

  generateFromTemplates(resolvePath: PathResolver): FileContent[] {
    const assetsFolder = 'src/assets';
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
      this.generateFileContent(readContent(d.template, resolvePath), d.output),
    );
  }

  private generateFileContent(template, output): FileContent {
    return {
      file: output,
      content: () =>
        HandlebarGenerator.generate(template, this._pluginsConfig.resolve()),
    };
  }

  private filesToCopy(resolvePath: PathResolver) {
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
      from: resolvePath(item.from),
      to: item.to,
    }));
  }

  private generate(resolvePath: PathResolver) {
    return [
      registryConfiguration(this._config.registry, resolvePath),
      ...this.generateFromTemplates(resolvePath),
    ];
  }
}
