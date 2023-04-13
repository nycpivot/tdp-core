import * as fs from 'fs';

export type PathResolver = (file: FilePath) => FilePath;

export type FilePath = string;

export type RawContent = string;

export type FileContent = {
  file: FilePath;
  content: RawContent | (() => RawContent);
};

export const readContent = (filePath, resolvePath: (file: string) => string) =>
  fs.readFileSync(resolvePath(filePath)).toString();

export const fileContentByCopy = (
  from: FilePath,
  to: FilePath,
  resolvePath: PathResolver,
): FileContent => ({
  file: to,
  content: readContent(from, resolvePath),
});
