import { execSync } from 'child_process';
import { FilePath } from './File';

export type Registry = 'verdaccio' | 'remote';

export const registryConfiguration = (registry: Registry): FilePath => {
  if (registry === 'verdaccio') {
    return `src/assets/.yarnrc`;
  } else if (registry === 'remote') {
    return '../../.yarnrc';
  }
  throw new Error(
    'invalid registry: please select between remote and verdaccio',
  );
};

export type VersionResolver = (name: string) => string;

export const yarnResolver = (yarnRcFolder: string) => {
  return (name: string) => {
    return execSync(`yarn info --cwd ${yarnRcFolder} -s ${name} version`)
      .toString('utf-8')
      .trim();
  };
};
