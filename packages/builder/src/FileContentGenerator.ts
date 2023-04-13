import { PluginsConfiguration } from './PluginsConfiguration';
import { PortalConfiguration } from './PortalConfiguration';
import { compile } from 'handlebars';
import { FileContent } from './FileContent';

const assetsFolder = 'src/assets';

export class HandlebarGenerator {
  static generate(templateString: string, config: any) {
    return compile(templateString)(config);
  }
}

export class TemplatedFilesGenerator {
  private readonly _pluginsConfig: PluginsConfiguration;
  private readonly _readFileContent: (file: string) => string;

  constructor(config: PortalConfiguration) {
    this._pluginsConfig = config.pluginsConfig;
    this._readFileContent = config.readFileContent;
  }

  get generate(): FileContent[] {
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
      this.generateFileContent(this._readFileContent(d.template), d.output),
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
