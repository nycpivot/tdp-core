const flattenNode = (node, ancestors) => {
  if (node.template) {
    return [
      {
        file: ancestors.join('/'),
        template: node.template,
      },
    ];
  }

  return node.files.flatMap(n => flattenNode(n, [...ancestors, n.name]));
};
export const flatten = (structure: any) => {
  return flattenNode(structure, []);
};
