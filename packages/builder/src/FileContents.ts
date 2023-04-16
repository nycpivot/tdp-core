import { compile } from 'handlebars';
import { FilePath, findInDir, RawContent, readContent } from './FileUtils';
import path from 'path';
import { PluginsResolver, Registry } from './Registry';

export function generate(template: RawContent, config: any) {
  return compile(template)(config);
}

type FileContent = {
  file: FilePath;
  content: RawContent | (() => RawContent);
};

function yarnrcConfiguration(bundleFolder: string, registry: Registry) {
  return {
    file: '.yarnrc',
    content: readContent(path.join(bundleFolder, `.yarnrc.${registry}`)),
  };
}

function templatedFiles(
  bundleFolder: string,
  pluginsResolver: PluginsResolver,
) {
  const templates = findInDir(bundleFolder, /\.hbs$/);
  const files = templates.map((t:string) => {
    return {
      file: t.replace(`${bundleFolder}/`, '').replace('.hbs', ''),
      content: () => generate(readContent(t), pluginsResolver.resolve()),
    };
  });
  return files;
}

export function prepareContents(
  bundleFolder: FilePath,
  pluginsResolver: PluginsResolver,
): FileContent[] {
  const contents: FileContent[] = [];
  contents.push(yarnrcConfiguration(bundleFolder, pluginsResolver.registry));
  contents.push(...templatedFiles(bundleFolder, pluginsResolver));
  return contents;
}
