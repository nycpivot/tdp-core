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
  private readonly _resolvePath: (file: string) => string;

  constructor(config: PortalConfiguration) {
    this._isProduction = config.isProduction;
    this._resolvePath = config.resolvePath;
  }

  get generate(): FileContent {
    return this._isProduction
      ? this.contentGenerator(`${assetsFolder}/.yarnrc`, '.yarnrc')
      : this.contentGenerator('../../.yarnrc', '.yarnrc');
  }

  private readFileContent(file): string {
    return fs.readFileSync(this._resolvePath(file)).toString();
  }

  private contentGenerator(filePath, output): FileContent {
    return {
      file: output,
      content: this.readFileContent(filePath),
    };
  }
}

export class TemplatedFilesGenerator {
  private readonly _pluginsConfig: PluginsConfiguration;
  private readonly _resolvePath: (file: string) => string;

  constructor(config: PortalConfiguration) {
    this._pluginsConfig = config.pluginsConfig;
    this._resolvePath = config.resolvePath;
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

  private readFileContent(file): string {
    return fs.readFileSync(this._resolvePath(file)).toString();
  }

  private templateGenerator(template, output): FileContent {
    return {
      file: output,
      content: () =>
        this._pluginsConfig.generate(this.readFileContent(template)),
    };
  }
}

export class FileContentGenerator {
  private _yarnrcGenerator: YarnrcFileGenerator;
  private _templateGenerators: TemplatedFilesGenerator;
  constructor(
    contentGenerators: YarnrcFileGenerator,
    templateGenerators: TemplatedFilesGenerator,
  ) {
    this._yarnrcGenerator = contentGenerators;
    this._templateGenerators = templateGenerators;
  }

  generate() {
    return [
      this._yarnrcGenerator.generate,
      ...this._templateGenerators.generate,
    ];
  }
}
