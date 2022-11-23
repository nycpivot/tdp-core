import { execSync } from 'child_process';

export namespace Git {
  export function currentBranch() {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' });
  }
}
