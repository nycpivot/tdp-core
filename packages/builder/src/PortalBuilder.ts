import {
  FileContent,
  TemplatedFilesGenerator,
  YarnrcFileGenerator,
} from './FileContentGenerator';
import { PortalConfiguration } from './PortalConfiguration';

export type Portal = {
  filesToCopy: { from: string; to: string }[];
  generatedContents: FileContent[];
};

export class PortalBuilder {
  private _config: PortalConfiguration;
  private _yarnrcGenerator: YarnrcFileGenerator;
  private _templateGenerators: TemplatedFilesGenerator;

  constructor(config: PortalConfiguration) {
    this._config = config;
    this._yarnrcGenerator = new YarnrcFileGenerator(config);
    this._templateGenerators = new TemplatedFilesGenerator(config);
  }

  build(): Portal {
    return {
      filesToCopy: this.filesToCopy,
      generatedContents: this.generate(),
    };
  }

  private get filesToCopy() {
    return [
      {
        from: this._config.resolvePath('../app/.eslintrc.js'),
        to: 'packages/app/.eslintrc.js',
      },
      {
        from: this._config.resolvePath('../backend/.eslintrc.js'),
        to: 'packages/backend/.eslintrc.js',
      },
      {
        from: this._config.resolvePath('../app/public'),
        to: 'packages/app/public',
      },
      {
        from: this._config.resolvePath('../../package.json'),
        to: 'package.json',
      },
      {
        from: this._config.resolvePath('../../tsconfig.json'),
        to: 'tsconfig.json',
      },
      {
        from: this._config.resolvePath('../../backstage.json'),
        to: 'backstage.json',
      },
      {
        from: this._config.appConfig,
        to: 'app-config.yaml',
      },
    ];
  }

  private generate() {
    return [
      this._yarnrcGenerator.generate,
      ...this._templateGenerators.generate,
    ];
  }
}
