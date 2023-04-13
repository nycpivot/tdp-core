import { compile } from 'handlebars';
import {
  RawContent,
  FileContent,
  FilePath,
  PathResolver,
  readContent,
} from './FileContent';

export class HandlebarGenerator {
  static generate(template: RawContent, config: any) {
    return compile(template)(config);
  }
}

export class HandlebarTemplate {
  private _template: FilePath;
  private _resolvePath: PathResolver;

  constructor(template: FilePath, resolvePath: PathResolver) {
    this._template = template;
    this._resolvePath = resolvePath;
  }

  createFileContent(output: FilePath, config: any): FileContent {
    return {
      file: output,
      content: this.generate(config),
    };
  }

  private generate(config: any) {
    return compile(readContent(this._template, this._resolvePath))(config);
  }
}
