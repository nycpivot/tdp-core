import { execSync } from 'child_process';
import { RegistryType } from './Registry';
import { FileContent } from './FileContents';

const verdaccioConfig = `registry "http://localhost:4873"`;

const artifactoryConfig = `"@tpb:registry" "https://artifactory.eng.vmware.com/artifactory/api/npm/tpb-npm-local/"
registry "https://build-artifactory.eng.vmware.com/artifactory/api/npm/npm/"`;

export class YarnResolver {
  private _yarnrcFolder: string;
  private _registryType: RegistryType;

  constructor(yarnrcFolder: string, registryType: RegistryType) {
    this._yarnrcFolder = yarnrcFolder;
    this._registryType = registryType;
  }

  resolve(plugin: string) {
    return execSync(
      `yarn info --cwd ${this._yarnrcFolder} -s ${plugin} version`,
    )
      .toString('utf-8')
      .trim();
  }

  configuration(): FileContent {
    return {
      file: '.yarnrc',
      content:
        this._registryType === 'verdaccio'
          ? verdaccioConfig
          : artifactoryConfig,
    };
  }
}
