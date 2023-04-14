import { compile } from 'handlebars';
import { PortalConfiguration } from './PortalConfiguration';
import {
  FileContent,
  FilePath,
  findInDir,
  RawContent,
  readContent,
} from './FileUtils';
import path from 'path';

export function generate(template: RawContent, config: any) {
  return compile(template)(config);
}

export function prepareTemplates(
  config: PortalConfiguration,
  bundleFolder: FilePath,
) {
  const contents: FileContent[] = [];

  contents.push({
    file: '.yarnrc',
    content: readContent(path.join(bundleFolder, `.yarnrc.${config.registry}`)),
  });

  const templates = findInDir(bundleFolder, /\.hbs$/);
  templates.forEach(t => {
    contents.push({
      file: t.replace(bundleFolder, config.outputFolder).replace('.hbs', ''),
      content: () => generate(readContent(t), config.pluginsResolver.resolve()),
    });
  });
  return contents;
}
