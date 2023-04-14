import fs from 'fs';
import path from 'path';

export type PathResolver = (file: FilePath) => FilePath;

export type FilePath = string;

export type RawContent = string;

export type FileContent = {
  file: FilePath;
  content: RawContent | (() => RawContent);
};

export const readContent = (file: FilePath): RawContent =>
  fs.readFileSync(file).toString();

export function findInDir(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const fileStat = fs.lstatSync(filePath);

    if (fileStat.isDirectory()) {
      findInDir(filePath, filter, fileList);
    } else if (filter.test(filePath)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}
