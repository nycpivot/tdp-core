import { compile } from 'handlebars';
import {
  RawContent,
  FileContent,
  FilePath,
  PathResolver,
  readContent,
} from './FileContent';
import { PluginsResolver } from './PluginsResolver';

export class HandlebarGenerator {
  static generate(template: RawContent, config: any) {
    return compile(template)(config);
  }
}

export class HandlebarTemplate {
  private readonly _template: FilePath;
  private readonly _resolvePath: PathResolver;

  constructor(template: FilePath, resolvePath: PathResolver) {
    this._template = template;
    this._resolvePath = resolvePath;
  }

  createFileContent(
    output: FilePath,
    pluginsResolver: PluginsResolver,
  ): FileContent {
    return {
      file: output,
      content: () => this.generate(pluginsResolver.resolve()),
    };
  }

  private generate(config: any) {
    return compile(readContent(this._resolvePath(this._template)))(config);
  }
}
