import { flattenCopies, flattenTemplates } from './BundleStructure';

describe('structure', () => {
  it('flatten templates', () => {
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

    const flatStructure = flattenTemplates(structure, file => file);

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

  it('flatten copies', () => {
    const structure = {
      files: [
        {
          name: 'foo.txt',
          copy: 'a/path/to/foo/file',
        },
        {
          name: 'bar.txt',
          copy: 'a/path/to/bar/file',
        },
        {
          name: 'folder',
          files: [
            {
              name: 'foo1.txt',
              copy: 'a/path/to/foo1/file',
            },
          ],
        },
      ],
    };

    const flatStructure = flattenCopies(structure, file => file);

    expect(flatStructure).toContainEqual({
      from: 'a/path/to/foo/file',
      to: 'foo.txt',
    });
    expect(flatStructure).toContainEqual({
      from: 'a/path/to/bar/file',
      to: 'bar.txt',
    });
    expect(flatStructure).toContainEqual({
      from: 'a/path/to/foo1/file',
      to: 'folder/foo1.txt',
    });
  });
});
