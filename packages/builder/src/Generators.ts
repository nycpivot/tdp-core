import { EnvironmentProperties } from './EnvironmentProperties';
import * as fs from 'fs';
import { TpbConfiguration } from './TpbConfiguration';
import { parse as parseYaml } from 'yaml';
import { yarnResolver } from './version_resolver';

const assetsFolder = 'src/assets';

type Generator = {
  file: string
  content: string | (() => string)
}

class YarnrcGenerator {
  private readonly _isProduction: boolean;
  private readonly _resolvePath: (file: string) => string;

  constructor(isProduction: boolean, pathResolver: (file: string) => string) {
    this._isProduction = isProduction;
    this._resolvePath = pathResolver;
  }

  get generator(): Generator {
    return this._isProduction
        ? this.contentGenerator(`${assetsFolder}/.yarnrc`, '.yarnrc')
        : this.contentGenerator('../../.yarnrc', '.yarnrc')
    ;
  }

  static fromEnv(env: EnvironmentProperties) {
    const isProduction = env.production !== undefined;
    return new YarnrcGenerator(isProduction, env.pathResolver);
  }

  private readFileContent(file): string {
    return fs.readFileSync(this._resolvePath(file)).toString();
  }

  private contentGenerator(filePath, output): Generator {
    return {
      file: output,
      content: this.readFileContent(filePath),
    };
  }
}

class TemplateGenerators {
  private readonly _tpbConfig: TpbConfiguration;
  private readonly _resolvePath: (file: string) => string;

  constructor(
    tpbConfig: TpbConfiguration,
    pathResolver: (file: string) => string,
  ) {
    this._tpbConfig = tpbConfig;
    this._resolvePath = pathResolver;
  }

  get generators(): Generator[] {
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

  private readFileContent(file): string {
    return fs.readFileSync(this._resolvePath(file)).toString();
  }

  private templateGenerator(template, output): Generator {
    return {
      file: output,
      content: () => this._tpbConfig.generate(this.readFileContent(template)),
    };
  }
}

export class Generators {
  private _yarnrcGenerator: YarnrcGenerator;
  private _templateGenerators: TemplateGenerators;
  constructor(contentGenerators: YarnrcGenerator, templateGenerators: TemplateGenerators) {
    this._yarnrcGenerator = contentGenerators;
    this._templateGenerators = templateGenerators;
  }

  get generators() {
    return [
      this._yarnrcGenerator.generator,
      ...this._templateGenerators.generators,
    ]
  }

  static fromEnv(env: EnvironmentProperties) {
    return new Generators(YarnrcGenerator.fromEnv(env), TemplateGenerators.fromEnv(env));
  }
}
