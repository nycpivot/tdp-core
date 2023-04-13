import { FilePath } from './FileContent';

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

const flattenNodeTemplate = (node: Node, ancestors: string[]): Foo[] => {
  if ('template' in node) {
    return [
      {
        file: ancestors.join('/'),
        template: node.template,
      },
    ];
  } else if ('copy' in node) {
    return [];
  }

  return node.files.flatMap(n =>
    flattenNodeTemplate(n, [...ancestors, n.name]),
  );
};

const flattenNodeCopy = (node: Node, ancestors: string[]): Bar[] => {
  if ('copy' in node) {
    return [
      {
        from: node.copy,
        to: ancestors.join('/'),
      },
    ];
  } else if ('template' in node) {
    return [];
  }

  return node.files.flatMap(n => flattenNodeCopy(n, [...ancestors, n.name]));
};

export const flattenTemplates = (structure: BundleStructure): Foo[] => {
  return flattenNodeTemplate({ name: 'root', ...structure }, []);
};

export const flattenCopies = (structure: BundleStructure): Bar[] => {
  return flattenNodeCopy({ name: 'root', ...structure }, []);
};
