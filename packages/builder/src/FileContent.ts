import * as fs from 'fs';

export type PathResolver = (file: string) => string;

export type FileContent = {
  file: string;
  content: string | (() => string);
};

export const readContent = (filePath, resolvePath: (file: string) => string) =>
  fs.readFileSync(resolvePath(filePath)).toString();

export const readFileContent = (
  filePath,
  output,
  resolvePath: PathResolver,
): FileContent => ({
  file: output,
  content: readContent(filePath, resolvePath),
});
