import { execSync } from 'child_process';
import { FileContent } from './FileContents';
import { readContent } from './FileUtils';

export class YarnResolver {
  private readonly _yarnrcFolder: string;
  private readonly _yarnrcConfig: string;

  constructor(yarnrcFolder: string, yarnrcConfig: string) {
    this._yarnrcFolder = yarnrcFolder;
    this._yarnrcConfig = yarnrcConfig;
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
      content: readContent(this._yarnrcConfig),
    };
  }
}
