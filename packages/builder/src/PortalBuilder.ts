import {
  FileContent,
  TemplatedFilesGenerator,
  YarnrcFileGenerator,
} from './FileContentGenerator';
import { PortalConfiguration } from './PortalConfiguration';

export type PathResolver = (file: string) => string;

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

  build(resolvePath: PathResolver): Portal {
    return {
      filesToCopy: this.filesToCopy(resolvePath),
      generatedContents: this.generate(),
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

  private generate() {
    return [
      this._yarnrcGenerator.generate,
      ...this._templateGenerators.generate,
    ];
  }
}
