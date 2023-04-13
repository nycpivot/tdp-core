import { compile } from 'handlebars';
import { RawContent, FileContent, FilePath, readContent } from './FileContent';
import { PluginsResolver } from './PluginsResolver';

export class HandlebarGenerator {
  static generate(template: RawContent, config: any) {
    return compile(template)(config);
  }
}

export class HandlebarTemplate {
  private readonly _template: FilePath;

  constructor(template: FilePath) {
    this._template = template;
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
    return compile(readContent(this._template))(config);
  }
}
