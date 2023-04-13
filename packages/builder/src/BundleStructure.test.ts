import { flatten } from './BundleStructure';

describe('structure', () => {
  it('can be flattened', () => {
    const structure = {
      files: [
        {
          name: 'foo.txt',
          template: 'a/path/to/foo/file',
        },
        {
          name: 'bar.txt',
          template: 'a/path/to/bar/file',
        },
        {
          name: 'folder',
          files: [
            {
              name: 'foo1.txt',
              template: 'a/path/to/foo1/file',
            },
          ],
        },
      ],
    };

    const flatStructure = flatten(structure);

    expect(flatStructure).toContainEqual({
      file: 'foo.txt',
      template: 'a/path/to/foo/file',
    });
    expect(flatStructure).toContainEqual({
      file: 'bar.txt',
      template: 'a/path/to/bar/file',
    });
    expect(flatStructure).toContainEqual({
      file: 'folder/foo1.txt',
      template: 'a/path/to/foo1/file',
    });
  });
});
