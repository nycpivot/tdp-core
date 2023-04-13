import * as fs from 'fs';

export type PathResolver = (file: string) => string;

export type FileContent = {
  file: string;
  content: string | (() => string);
};

export const readFileContent = (
  filePath,
  output,
  resolvePath: PathResolver,
): FileContent => ({
  file: output,
  content: fs.readFileSync(resolvePath(filePath)).toString(),
});
