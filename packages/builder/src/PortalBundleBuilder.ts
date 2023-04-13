import { PortalConfiguration } from './PortalConfiguration';
import { FileContent, FileCopy, readContent } from './FileContent';
import { HandlebarTemplate } from './HandlebarTemplate';

type CopyBundle = FileCopy[];
type ContentBundle = FileContent[];

export type PortalBundle = {
  copyBundle: CopyBundle;
  contentBundle: ContentBundle;
};

export class PortalBundleBuilder {
  private readonly _config: PortalConfiguration;

  constructor(config: PortalConfiguration) {
    this._config = config;
  }

  build(): PortalBundle {
    return {
      copyBundle: this.copyBundle(),
      contentBundle: this.contentBundle(),
    };
  }

  private copyBundle(): CopyBundle {
    return [
      ...this._config.structure.copies,
      {
        from: this._config.appConfig,
        to: 'app-config.yaml',
      },
    ];
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
