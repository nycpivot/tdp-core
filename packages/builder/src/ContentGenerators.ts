import { EnvironmentProperties } from './EnvironmentProperties';
import * as fs from 'fs';
import { TpbConfiguration } from './TpbConfiguration';
import { parse as parseYaml } from 'yaml';
import { yarnResolver } from './version_resolver';

export class ContentGenerators {
  private readonly _isProduction: boolean;
  private readonly _resolvePath: (file: string) => string;

  constructor(isProduction: boolean, pathResolver: (file: string) => string) {
    this._isProduction = isProduction;
    this._resolvePath = pathResolver;
  }

  get generators() {
    return [
      this._isProduction
        ? this.contentGenerator('src/assets/.yarnrc', '.yarnrc')
        : this.contentGenerator('../../.yarnrc', '.yarnrc'),
    ];
  }

  static fromEnv(env: EnvironmentProperties) {
    const isProduction = env.production !== undefined;

    return new ContentGenerators(isProduction, env.pathResolver);
  }

  private readFileContent(file) {
    return fs.readFileSync(this._resolvePath(file)).toString();
  }

  private contentGenerator(filePath, output) {
    return {
      file: output,
      content: this.readFileContent(filePath),
    };
  }
}

export class TemplateGenerators {
  private readonly _tpbConfig: TpbConfiguration;
  private readonly _resolvePath: (file: string) => string;

  constructor(
    tpbConfig: TpbConfiguration,
    pathResolver: (file: string) => string,
  ) {
    this._tpbConfig = tpbConfig;
    this._resolvePath = pathResolver;
  }

  get generators() {
    return [
      this.templateGenerator(
        'src/assets/packages/app/src/index.ts.hbs',
        'packages/app/src/index.ts',
      ),
      this.templateGenerator(
        'src/assets/packages/app/package.json.hbs',
        'packages/app/package.json',
      ),
      this.templateGenerator(
        'src/assets/packages/backend/src/index.ts.hbs',
        'packages/backend/src/index.ts',
      ),
      this.templateGenerator(
        'src/assets/packages/backend/package.json.hbs',
        'packages/backend/package.json',
      ),
    ];
  }

  static fromEnv(env: EnvironmentProperties) {
    const configFile =
      env.tpb_config || env.pathResolver('conf/tpb-config.yaml');
    const outputFolder = env.output_folder || 'portal';
    const yarnRcFolder = env.yarnrc_folder || outputFolder;

    return new TemplateGenerators(
      new TpbConfiguration(
        parseYaml(fs.readFileSync(configFile).toString('utf-8')),
        yarnResolver(yarnRcFolder),
      ),
      env.pathResolver,
    );
  }

  private readFileContent(file) {
    return fs.readFileSync(this._resolvePath(file)).toString();
  }

  private templateGenerator(template, output) {
    return {
      file: output,
      content: () => this._tpbConfig.generate(this.readFileContent(template)),
    };
  }
}
