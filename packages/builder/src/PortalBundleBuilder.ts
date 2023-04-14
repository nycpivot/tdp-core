import { PortalConfiguration } from './PortalConfiguration';
import { FileContent, readContent } from './File';
import { HandlebarTemplate } from './HandlebarTemplate';

type ContentBundle = FileContent[];

export type PortalBundle = {
  contentBundle: ContentBundle;
};

export class PortalBundleBuilder {
  private readonly _config: PortalConfiguration;

  constructor(config: PortalConfiguration) {
    this._config = config;
  }

  build(): PortalBundle {
    return {
      contentBundle: this.contentBundle(),
    };
  }

  private contentBundle(): ContentBundle {
    return [
      {
        file: '.yarnrc',
        content: readContent(this._config.registryConfiguration),
      },
      ...this.contentBundleFromTemplates(),
    ];
  }

  private contentBundleFromTemplates(): ContentBundle {
    return this._config.structure.templates.map(d =>
      new HandlebarTemplate(d.template).createFileContent(
        d.file,
        this._config.pluginsResolver,
      ),
    );
  }
}
