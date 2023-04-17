import { compile } from 'handlebars';
import { FilePath, findInDir, RawContent, readContent } from './FileUtils';
import { Registry } from './Registry';

export function generate(template: RawContent, config: any) {
  return compile(template)(config);
}

export type FileContent = {
  file: FilePath;
  content: RawContent | (() => RawContent);
};

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
  registry: Registry,
): FileContent[] {
  const contents: FileContent[] = [];
  contents.push(registry.resolverConfiguration);
  contents.push(...templatedFiles(bundleFolder, registry));
  return contents;
}
