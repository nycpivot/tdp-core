import { PluginsConfiguration } from './PluginsConfiguration';
import { PortalConfiguration } from './PortalConfiguration';
import { compile } from 'handlebars';

const assetsFolder = 'src/assets';

export type FileContent = {
  file: string;
  content: string | (() => string);
};

export class YarnrcFileGenerator {
  private readonly _isProduction: boolean;
  private readonly _readFileContent: (file: string) => string;

  constructor(config: PortalConfiguration) {
    this._isProduction = config.mode === 'production';
    this._readFileContent = config.readFileContent;
  }

  get generate(): FileContent {
    return this._isProduction
      ? this.contentGenerator(`${assetsFolder}/.yarnrc`, '.yarnrc')
      : this.contentGenerator('../../.yarnrc', '.yarnrc');
  }

  private contentGenerator(filePath, output): FileContent {
    return {
      file: output,
      content: this._readFileContent(filePath),
    };
  }
}

export class HandlebarGenerator {
  static generate(templateString: string, config: any) {
    return compile(templateString)(config);
  }
}

export class TemplatedFilesGenerator {
  private readonly _pluginsConfig: PluginsConfiguration;
  private readonly _readFileContent: (file: string) => string;

  constructor(config: PortalConfiguration) {
    this._pluginsConfig = config.pluginsConfig;
    this._readFileContent = config.readFileContent;
  }

  get generate(): FileContent[] {
    const data = [
      {
        template: `${assetsFolder}/packages/app/src/index.ts.hbs`,
        output: 'packages/app/src/index.ts',
      },
      {
        template: `${assetsFolder}/packages/app/package.json.hbs`,
        output: 'packages/app/src/index.ts',
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

    return data.map(d => this.generateFileContent(d.template, d.output));
  }

  private generateFileContent(template, output): FileContent {
    return {
      file: output,
      content: () =>
        HandlebarGenerator.generate(template, this._pluginsConfig.resolve()),
    };
  }
}
