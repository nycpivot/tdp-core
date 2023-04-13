import { PluginsConfiguration } from './PluginsConfiguration';
import { compile } from 'handlebars';
import { FileContent, PathResolver, readContent } from './FileContent';

const assetsFolder = 'src/assets';

export class HandlebarGenerator {
  static generate(templateString: string, config: any) {
    return compile(templateString)(config);
  }
}

export class TemplatedFilesGenerator {
  private readonly _pluginsConfig: PluginsConfiguration;

  constructor(pluginsConfig: PluginsConfiguration) {
    this._pluginsConfig = pluginsConfig;
  }

  generate(resolvePath: PathResolver): FileContent[] {
    const data = [
      {
        template: `${assetsFolder}/packages/app/src/index.ts.hbs`,
        output: 'packages/app/src/index.ts',
      },
      {
        template: `${assetsFolder}/packages/app/package.json.hbs`,
        output: 'packages/app/package.json',
      },
      {
        template: `${assetsFolder}/packages/backend/src/index.ts.hbs`,
        output: 'packages/backend/src/index.ts',
      },
      {
        template: `${assetsFolder}/packages/backend/package.json.hbs`,
        output: 'packages/backend/package.json',
      },
    ];

    return data.map(d =>
      this.generateFileContent(readContent(d.template, resolvePath), d.output),
    );
  }

  private generateFileContent(template, output): FileContent {
    return {
      file: output,
      content: () =>
        HandlebarGenerator.generate(template, this._pluginsConfig.resolve()),
    };
  }
}
