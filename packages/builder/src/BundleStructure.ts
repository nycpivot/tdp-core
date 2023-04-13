import { FilePath } from './FileContent';

type FolderNode = {
  name: string;
  files: Node[];
};

type TemplateNode = {
  name: string;
  template: string;
};

type Node = FolderNode | TemplateNode;

type BundleStructure = {
  files: Node[];
};

type Foo = {
  file: FilePath;
  template: FilePath;
};

const flattenNode = (node: Node, ancestors: string[]): Foo[] => {
  if ('template' in node) {
    return [
      {
        file: ancestors.join('/'),
        template: node.template,
      },
    ];
  }

  return node.files.flatMap(n => flattenNode(n, [...ancestors, n.name]));
};

export const flatten = (structure: BundleStructure): Foo[] => {
  return flattenNode({ name: 'root', ...structure }, []);
};
