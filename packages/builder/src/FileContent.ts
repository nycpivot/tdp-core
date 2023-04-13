import * as fs from 'fs';

export type PathResolver = (file: string) => string;

export type FileContent = {
  file: string;
  content: string | (() => string);
};

export const readContent = (filePath, resolvePath: (file: string) => string) =>
  fs.readFileSync(resolvePath(filePath)).toString();

export const fileContentByCopy = (
  from,
  to,
  resolvePath: PathResolver,
): FileContent => ({
  file: to,
  content: readContent(from, resolvePath),
});
