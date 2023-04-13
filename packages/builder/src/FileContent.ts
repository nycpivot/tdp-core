import * as fs from 'fs';

export type PathResolver = (file: FilePath) => FilePath;

export type FilePath = string;

export type RawContent = string;

export type FileContent = {
  file: FilePath;
  content: RawContent | (() => RawContent);
};

export const readContent = (file: FilePath): RawContent =>
  fs.readFileSync(file).toString();
