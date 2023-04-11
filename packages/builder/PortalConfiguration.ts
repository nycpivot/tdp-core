import { TpbConfiguration } from './src/TpbConfiguration';
import { parse as parseYaml } from 'yaml';
import * as fs from 'fs';
import { yarnResolver } from './src/version_resolver';
import * as path from 'path';
import { compile } from 'handlebars';

const template = file => {
  return compile(fs.readFileSync(path.resolve(__dirname, file)).toString());
};

const generate = (file, templateFile, config: TpbConfiguration) => {
  return {
    file: file,
    content: () => template(templateFile)(config.resolve()),
  };
};

export const prepareData = (portalConfiguration: PortalConfiguration) => {
  const config = portalConfiguration.tpbConfig;
  return {
    fileContents: [
      {
        file: '.yarnrc',
        content: portalConfiguration.isProduction
          ? fs.readFileSync(path.resolve(__dirname, 'assets/.yarnrc'))
          : fs.readFileSync(path.resolve(__dirname, '../../.yarnrc')),
      },
      generate(
        'packages/app/src/index.ts',
        'assets/packages/app/src/index.ts.hbs',
        config,
      ),
      generate(
        'packages/app/package.json',
        'assets/packages/app/package.json.hbs',
        config,
      ),
      generate(
        'packages/backend/src/index.ts',
        'assets/packages/backend/src/index.ts.hbs',
        config,
      ),
      generate(
        'packages/backend/package.json',
        'assets/packages/backend/package.json.hbs',
        config,
      ),
    ],
    filesToCopy: [
      {
        from: path.resolve(__dirname, '../app/.eslintrc.js'),
        to: 'packages/app/.eslintrc.js',
      },
      {
        from: path.resolve(__dirname, '../backend/.eslintrc.js'),
        to: 'packages/backend/.eslintrc.js',
      },
      {
        from: path.resolve(__dirname, '../app/public'),
        to: 'packages/app/public',
      },
      {
        from: path.resolve(__dirname, '../../package.json'),
        to: 'package.json',
      },
      {
        from: path.resolve(__dirname, '../../tsconfig.json'),
        to: 'tsconfig.json',
      },
      {
        from: path.resolve(__dirname, '../../backstage.json'),
        to: 'backstage.json',
      },
      {
        from: portalConfiguration.appConfigFile,
        to: 'app-config.yaml',
      },
    ],
  };
};

type EnvironmentProperties = {
  app_config: string | undefined;
  output_folder: string | undefined;
  tpb_config: string | undefined;
  yarnrc_folder: string | undefined;
  production: string | undefined;
};

export class PortalConfiguration {
  private readonly _isProduction: boolean;
  private readonly _configFile: string;
  private readonly _outputFolder: string;
  private readonly _yarnrcFolder: string;
  private readonly _appConfigFile: string;

  constructor(
    isProduction: boolean,
    configFile: string,
    outputFolder: string,
    yarnrcFolder: string,
    appConfigFile: string,
  ) {
    this._isProduction = isProduction;
    this._configFile = configFile;
    this._outputFolder = outputFolder;
    this._yarnrcFolder = yarnrcFolder;
    this._appConfigFile = appConfigFile;
  }

  get outputFolder() {
    return this._outputFolder;
  }

  get isProduction() {
    return this._isProduction;
  }

  get tpbConfig() {
    return new TpbConfiguration(
      parseYaml(fs.readFileSync(this._configFile).toString('utf-8')),
      yarnResolver(this._yarnrcFolder),
    );
  }

  get appConfigFile() {
    return this._appConfigFile;
  }

  static fromEnv(env: EnvironmentProperties) {
    const isProduction = env.production !== undefined;
    const configFile =
      env.tpb_config || path.resolve(__dirname, 'conf/tpb-config.yaml');
    const outputFolder = env.output_folder || 'portal';
    const yarnRcFolder = env.yarnrc_folder || outputFolder;
    const appConfig =
      env.app_config || path.resolve(__dirname, 'conf/app-config.yaml');

    return new PortalConfiguration(
      isProduction,
      configFile,
      outputFolder,
      yarnRcFolder,
      appConfig,
    );
  }
}
