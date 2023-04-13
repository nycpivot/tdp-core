import { execSync } from 'child_process';
import { FileContent, PathResolver, readFileContent } from './FileContent';

export type Registry = 'verdaccio' | 'remote';

export const registryConfiguration = (
  registry: Registry,
  resolvePath: PathResolver,
): FileContent => {
  switch (registry) {
    case 'verdaccio':
      return readFileContent('src/assets/.yarnrc', '.yarnrc', resolvePath);

    case 'remote':
      return readFileContent('../../.yarnrc', '.yarnrc', resolvePath);

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
