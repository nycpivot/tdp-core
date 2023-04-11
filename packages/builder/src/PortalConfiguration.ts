import { TpbConfiguration } from './TpbConfiguration';
import { parse as parseYaml } from 'yaml';
import * as fs from 'fs';
import { yarnResolver } from './version_resolver';
import * as path from 'path';

const resolvePath = file => path.resolve(path.dirname(__filename), file);

function readFileContent(file) {
  return fs.readFileSync(resolvePath(file)).toString();
}

type EnvironmentProperties = {
  app_config: string | undefined;
  output_folder: string | undefined;
  tpb_config: string | undefined;
  yarnrc_folder: string | undefined;
  production: string | undefined;
};

export class CopySpecifications {
  private readonly _appConfigFile: string;

  constructor(appConfigFile: string) {
    this._appConfigFile = appConfigFile;
  }

  static fromEnv(env: EnvironmentProperties) {
    const appConfig = env.app_config || resolvePath('../conf/app-config.yaml');
    return new CopySpecifications(appConfig);
  }

  get filesToCopy() {
    return [
      {
        from: resolvePath('../../app/.eslintrc.js'),
        to: 'packages/app/.eslintrc.js',
      },
      {
        from: resolvePath('../../backend/.eslintrc.js'),
        to: 'packages/backend/.eslintrc.js',
      },
      {
        from: resolvePath('../../app/public'),
        to: 'packages/app/public',
      },
      {
        from: resolvePath('../../../package.json'),
        to: 'package.json',
      },
      {
        from: resolvePath('../../../tsconfig.json'),
        to: 'tsconfig.json',
      },
      {
        from: resolvePath('../../../backstage.json'),
        to: 'backstage.json',
      },
      {
        from: this._appConfigFile,
        to: 'app-config.yaml',
      },
    ];
  }
}

export class PortalConfiguration {
  private readonly _isProduction: boolean;
  private readonly _outputFolder: string;
  private readonly _tpbConfig: TpbConfiguration;

  constructor(
    isProduction: boolean,
    configFile: string,
    outputFolder: string,
    yarnrcFolder: string,
  ) {
    this._isProduction = isProduction;
    this._outputFolder = outputFolder;
    this._tpbConfig = new TpbConfiguration(
      parseYaml(fs.readFileSync(configFile).toString('utf-8')),
      yarnResolver(yarnrcFolder),
    );
  }

  get outputFolder() {
    return this._outputFolder;
  }
  get mode() {
    return this._isProduction ? 'production' : 'development';
  }

  private templateGenerator(template, output) {
    return {
      file: output,
      content: () => this._tpbConfig.generate(readFileContent(template)),
    };
  }

  private contentGenerator(filePath, output) {
    return {
      file: output,
      content: readFileContent(filePath),
    };
  }

  get fileGenerators() {
    return [
      this._isProduction
        ? this.contentGenerator('assets/.yarnrc', '.yarnrc')
        : this.contentGenerator('../../../.yarnrc', '.yarnrc'),
      this.templateGenerator(
        'assets/packages/app/src/index.ts.hbs',
        'packages/app/src/index.ts',
      ),
      this.templateGenerator(
        'assets/packages/app/package.json.hbs',
        'packages/app/package.json',
      ),
      this.templateGenerator(
        'assets/packages/backend/src/index.ts.hbs',
        'packages/backend/src/index.ts',
      ),
      this.templateGenerator(
        'assets/packages/backend/package.json.hbs',
        'packages/backend/package.json',
      ),
    ];
  }

  static fromEnv(env: EnvironmentProperties) {
    const isProduction = env.production !== undefined;
    const configFile = env.tpb_config || resolvePath('../conf/tpb-config.yaml');
    const outputFolder = env.output_folder || 'portal';
    const yarnRcFolder = env.yarnrc_folder || outputFolder;
    const appConfig = env.app_config || resolvePath('../conf/app-config.yaml');

    return new PortalConfiguration(
      isProduction,
      configFile,
      outputFolder,
      yarnRcFolder,
    );
  }
}
