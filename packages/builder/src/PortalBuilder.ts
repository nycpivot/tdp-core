import { TpbConfiguration } from './TpbConfiguration';
import { parse as parseYaml } from 'yaml';
import * as fs from 'fs';
import { yarnResolver } from './version_resolver';
import { EnvironmentProperties } from './EnvironmentProperties';
import { CopyPatterns } from './CopyPatterns';
import {
  FileContent,
  FileContentGenerator,
  TemplatedFilesGenerator,
  YarnrcFileGenerator,
} from './FileContentGenerator';

export type Portal = {
  filesToCopy: { from: string; to: string }[];
  generatedContents: FileContent[];
  outputFolder: string;
};

export type PortalConfiguration = {
  appConfig: string;
  outputFolder: string;
  pluginsConfig: TpbConfiguration;
  pathResolver: (file: string) => string;
};

export const mapEnvProperties = (
  env: EnvironmentProperties,
): PortalConfiguration => {
  const configFile = env.tpb_config || env.pathResolver('conf/tpb-config.yaml');
  const outputFolder = env.output_folder || 'portal';
  const yarnrcFolder = env.yarnrc_folder || outputFolder;
  const appConfig = env.app_config || env.pathResolver('conf/app-config.yaml');

  return {
    appConfig: appConfig,
    outputFolder: outputFolder,
    pluginsConfig: new TpbConfiguration(
      parseYaml(fs.readFileSync(configFile).toString('utf-8')),
      yarnResolver(yarnrcFolder),
    ),
    pathResolver: env.pathResolver,
  };
};

export class PortalBuilder {
  private readonly _outputFolder: string;
  private _copyPatterns: CopyPatterns;
  private _fileContents: FileContentGenerator;

  constructor(
    outputFolder: string,
    copyPatterns: CopyPatterns,
    fileContents: FileContentGenerator,
  ) {
    this._outputFolder = outputFolder;
    this._copyPatterns = copyPatterns;
    this._fileContents = fileContents;
  }

  build(): Portal {
    return {
      filesToCopy: this._copyPatterns.patterns,
      generatedContents: this._fileContents.generate(),
      outputFolder: this._outputFolder,
    };
  }
  static fromConfig(config: PortalConfiguration) {
    const copyPatterns = new CopyPatterns(
      config.appConfig,
      config.pathResolver,
    );
    const fileContents = new FileContentGenerator(
      new YarnrcFileGenerator(false, config.pathResolver),
      new TemplatedFilesGenerator(config.pluginsConfig, config.pathResolver),
    );

    return new PortalBuilder(config.outputFolder, copyPatterns, fileContents);
  }
}
