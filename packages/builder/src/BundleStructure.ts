import { FilePath, PathResolver, readContent } from './FileContent';
import { parse as parseYaml } from 'yaml';

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

type BundleStructure = {
  files: Node[];
};

type Foo = {
  file: FilePath;
  template: FilePath;
};

type Bar = {
  from: FilePath;
  to: FilePath;
};

const flattenNodeTemplate = (
  node: Node,
  ancestors: string[],
  resolvePath: PathResolver,
): Foo[] => {
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

const flattenNodeCopy = (
  node: Node,
  ancestors: string[],
  resolvePath: PathResolver,
): Bar[] => {
  if ('copy' in node) {
    return [
      {
        from: resolvePath(node.copy),
        to: ancestors.join('/'),
      },
    ];
  } else if ('template' in node) {
    return [];
  }

  return node.files.flatMap(n =>
    flattenNodeCopy(n, [...ancestors, n.name], resolvePath),
  );
};

export const flattenTemplates = (
  structure: BundleStructure,
  resolvePath: PathResolver,
): Foo[] => {
  return flattenNodeTemplate({ name: 'root', ...structure }, [], resolvePath);
};

export const flattenCopies = (
  structure: BundleStructure,
  resolvePath: PathResolver,
): Bar[] => {
  return flattenNodeCopy({ name: 'root', ...structure }, [], resolvePath);
};
