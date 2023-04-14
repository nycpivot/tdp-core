import { execSync } from 'child_process';

export type Registry = 'verdaccio' | 'artifactory';
export type VersionResolver = (name: string) => string;

export const yarnResolver = (yarnRcFolder: string) => {
  return (name: string) => {
    return execSync(`yarn info --cwd ${yarnRcFolder} -s ${name} version`)
      .toString('utf-8')
      .trim();
  };
};
