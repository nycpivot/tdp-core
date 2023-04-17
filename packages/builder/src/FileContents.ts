import { compile } from 'handlebars';
import { FilePath, findInDir, RawContent, readContent } from './FileUtils';
import path from 'path';
import { Registry, RegistryType } from './Registry';

export function generate(template: RawContent, config: any) {
  return compile(template)(config);
}

export type FileContent = {
  file: FilePath;
  content: RawContent | (() => RawContent);
};

function yarnrcConfiguration(bundleFolder: string, registry: RegistryType) {
  return {
    file: '.yarnrc',
    content: readContent(path.join(bundleFolder, `.yarnrc.${registry}`)),
  };
}

function templatedFiles(
  bundleFolder: string,
  pluginsResolver: Registry,
): FileContent[] {
  const templates = findInDir(bundleFolder, /\.hbs$/);
  const files = templates.map((t: string) => {
    return {
      file: t.replace(`${bundleFolder}/`, '').replace('.hbs', ''),
      content: () => generate(readContent(t), pluginsResolver.resolve()),
    };
  });
  return files;
}

export function buildContents(
  bundleFolder: FilePath,
  pluginsResolver: Registry,
): FileContent[] {
  const contents: FileContent[] = [];
  contents.push(yarnrcConfiguration(bundleFolder, pluginsResolver.registry));
  contents.push(...templatedFiles(bundleFolder, pluginsResolver));
  return contents;
}
