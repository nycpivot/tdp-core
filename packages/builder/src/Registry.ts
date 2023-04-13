import { execSync } from 'child_process';
import {
  FileContent,
  FilePath,
  PathResolver,
  readContent,
} from './FileContent';

export type Registry = 'verdaccio' | 'remote';

export const registryConfiguration = (
  registry: Registry,
  assetsFolder: FilePath,
  resolvePath: PathResolver,
): FileContent => {
  switch (registry) {
    case 'verdaccio':
      return {
        file: '.yarnrc',
        content: readContent(resolvePath(`${assetsFolder}/.yarnrc`)),
      };

    case 'remote':
      return {
        file: '.yarnrc',
        content: readContent(resolvePath('../../.yarnrc')),
      };

    default:
      throw new Error('invalid registry: select between remote and verdaccio');
  }
};

export type VersionResolver = (name: string) => string;

export const yarnResolver = (yarnRcFolder: string) => {
  return (name: string) => {
    return execSync(`yarn info --cwd ${yarnRcFolder} -s ${name} version`)
      .toString('utf-8')
      .trim();
  };
};
