import path from 'path';
import { findInDir } from './FileUtils';

describe('File utilities', () => {
  it('find files by extension', () => {
    const files = findInDir(resolve('../bundle'), /\.hbs$/);

    expect(files.length).toEqual(4);
    expect(files).toContainEqual(
      resolve('../bundle/packages/app/package.json.hbs'),
    );
    expect(files).toContainEqual(
      resolve('../bundle/packages/app/src/index.ts.hbs'),
    );
    expect(files).toContainEqual(
      resolve('../bundle/packages/backend/package.json.hbs'),
    );
    expect(files).toContainEqual(
      resolve('../bundle/packages/backend/src/index.ts.hbs'),
    );
  });
});

function resolve(filepath: string) {
  return path.join(path.dirname(__filename), filepath);
}
