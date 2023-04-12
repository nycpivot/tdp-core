import {
  FileContent,
  FileContentGenerator,
  TemplatedFilesGenerator,
  YarnrcFileGenerator,
} from './FileContentGenerator';
import { PortalConfiguration } from './PortalConfiguration';

export type Portal = {
  filesToCopy: { from: string; to: string }[];
  generatedContents: FileContent[];
  outputFolder: string;
};

export class PortalBuilder {
  private _config: PortalConfiguration;
  private _contentsGenerator: FileContentGenerator;

  private constructor(
    config: PortalConfiguration,
    fileContents: FileContentGenerator,
  ) {
    this._config = config;
    this._contentsGenerator = fileContents;
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

  build(): Portal {
    return {
      filesToCopy: this.filesToCopy,
      generatedContents: this._contentsGenerator.generate(),
      outputFolder: this._config.outputFolder,
    };
  }

  static fromConfig(config: PortalConfiguration) {
    const fileContents = new FileContentGenerator(
      new YarnrcFileGenerator(config),
      new TemplatedFilesGenerator(config),
    );

    return new PortalBuilder(config, fileContents);
  }
}
