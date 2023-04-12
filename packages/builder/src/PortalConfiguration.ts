import { TpbConfiguration } from './TpbConfiguration';
import { parse as parseYaml } from 'yaml';
import * as fs from 'fs';
import { yarnResolver } from './version_resolver';
import { EnvironmentProperties } from './EnvironmentProperties';

export class PortalConfiguration {
  private readonly _outputFolder: string;
  private readonly _tpbConfig: TpbConfiguration;

  constructor(configFile: string, outputFolder: string, yarnrcFolder: string) {
    this._outputFolder = outputFolder;
    this._tpbConfig = new TpbConfiguration(
      parseYaml(fs.readFileSync(configFile).toString('utf-8')),
      yarnResolver(yarnrcFolder),
    );
  }

  get outputFolder() {
    return this._outputFolder;
  }

  static fromEnv(env: EnvironmentProperties) {
    const configFile =
      env.tpb_config || env.pathResolver('conf/tpb-config.yaml');
    const outputFolder = env.output_folder || 'portal';
    const yarnRcFolder = env.yarnrc_folder || outputFolder;

    return new PortalConfiguration(configFile, outputFolder, yarnRcFolder);
  }
}
