import { TpbConfiguration } from './TpbConfiguration';
import { parse as parseYaml } from 'yaml';
import * as fs from 'fs';
import { yarnResolver } from './version_resolver';
import { EnvironmentProperties } from './EnvironmentProperties';
import { CopyPatterns } from './CopyPatterns';
import { FileContentGenerator } from './FileContentGenerator';

export class PortalBuilder {
  private readonly _outputFolder: string;
  private readonly _tpbConfig: TpbConfiguration;
  private _copyPatterns: CopyPatterns;
  private _fileContents: FileContentGenerator;

  constructor(
    configFile: string,
    outputFolder: string,
    yarnrcFolder: string,
    copyPatterns: CopyPatterns,
    fileContents: FileContentGenerator,
  ) {
    this._outputFolder = outputFolder;
    this._copyPatterns = copyPatterns;
    this._fileContents = fileContents;
    this._tpbConfig = new TpbConfiguration(
      parseYaml(fs.readFileSync(configFile).toString('utf-8')),
      yarnResolver(yarnrcFolder),
    );
  }

  get outputFolder() {
    return this._outputFolder;
  }

  generate() {
    return this._fileContents.generate();
  }

  get copyPatterns() {
    return this._copyPatterns.patterns;
  }

  static fromEnv(env: EnvironmentProperties) {
    const configFile =
      env.tpb_config || env.pathResolver('conf/tpb-config.yaml');
    const outputFolder = env.output_folder || 'portal';
    const yarnRcFolder = env.yarnrc_folder || outputFolder;

    const copyPatterns = CopyPatterns.fromEnv(env);
    const fileContents = FileContentGenerator.fromEnv(env);

    return new PortalBuilder(
      configFile,
      outputFolder,
      yarnRcFolder,
      copyPatterns,
      fileContents,
    );
  }
}
