import { FilePath, PathResolver, TemplatedFile } from './File';

type FolderNode = {
  name: string;
  files: Node[];
};

type TemplateNode = {
  name: string;
  template: FilePath;
};

type CopyNode = {
  name: string;
  copy: FilePath;
};

type Node = FolderNode | TemplateNode | CopyNode;

type BundleStructureConfiguration = {
  files: Node[];
};

const flattenNodeTemplate = (
  node: Node,
  ancestors: string[],
  resolvePath: PathResolver,
): TemplatedFile[] => {
  if ('template' in node) {
    return [
      {
        file: ancestors.join('/'),
        template: resolvePath(node.template),
      },
    ];
  } else if ('copy' in node) {
    return [];
  }

  return node.files.flatMap(n =>
    flattenNodeTemplate(n, [...ancestors, n.name], resolvePath),
  );
};

export const flattenTemplates = (
  structure: BundleStructureConfiguration,
  resolvePath: PathResolver,
): TemplatedFile[] => {
  return flattenNodeTemplate({ name: 'root', ...structure }, [], resolvePath);
};

export type BundleStructure = {
  templates: TemplatedFile[];
};

export const buildStructure = (
  config: BundleStructureConfiguration,
  resolvePath: PathResolver,
): BundleStructure => {
  return {
    templates: flattenTemplates(config, resolvePath),
  };
};
