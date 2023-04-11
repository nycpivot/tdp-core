import {EnvironmentProperties} from "./EnvironmentProperties";
import * as fs from "fs";

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
        ? this.contentGenerator('assets/.yarnrc', '.yarnrc')
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
