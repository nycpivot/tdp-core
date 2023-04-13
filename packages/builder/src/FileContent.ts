import * as fs from 'fs';

export type PathResolver = (file: FilePath) => FilePath;

export type FilePath = string;

export type RawContent = string;

export type FileContent = {
  file: FilePath;
  content: RawContent | (() => RawContent);
};

export const readContent = (
  file: FilePath,
  resolvePath: (file: FilePath) => RawContent,
) => fs.readFileSync(resolvePath(file)).toString();

export const fileContentByCopy = (
  from: FilePath,
  to: FilePath,
  resolvePath: PathResolver,
): FileContent => ({
  file: to,
  content: readContent(from, resolvePath),
});
