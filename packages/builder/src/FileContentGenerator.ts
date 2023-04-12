import * as fs from 'fs';
import { PluginsConfiguration } from './PluginsConfiguration';
import { PortalConfiguration } from './PortalConfiguration';

const assetsFolder = 'src/assets';

export type FileContent = {
  file: string;
  content: string | (() => string);
};

export class YarnrcFileGenerator {
  private readonly _isProduction: boolean;
  private readonly _readFileContent: (file: string) => string;

  constructor(config: PortalConfiguration) {
    this._isProduction = config.isProduction;
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

export class TemplatedFilesGenerator {
  private readonly _pluginsConfig: PluginsConfiguration;
  private readonly _readFileContent: (file: string) => string;

  constructor(config: PortalConfiguration) {
    this._pluginsConfig = config.pluginsConfig;
    this._readFileContent = config.readFileContent;
  }

  get generate(): FileContent[] {
    return [
      this.templateGenerator(
        `${assetsFolder}/packages/app/src/index.ts.hbs`,
        'packages/app/src/index.ts',
      ),
      this.templateGenerator(
        `${assetsFolder}/packages/app/package.json.hbs`,
        'packages/app/package.json',
      ),
      this.templateGenerator(
        `${assetsFolder}/packages/backend/src/index.ts.hbs`,
        'packages/backend/src/index.ts',
      ),
      this.templateGenerator(
        `${assetsFolder}/packages/backend/package.json.hbs`,
        'packages/backend/package.json',
      ),
    ];
  }

  private templateGenerator(template, output): FileContent {
    return {
      file: output,
      content: () =>
        this._pluginsConfig.generate(this._readFileContent(template)),
    };
  }
}
