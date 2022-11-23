// eslint-disable-next-line no-restricted-imports
import { execSync, ExecSyncOptions } from 'child_process';
// eslint-disable-next-line no-restricted-imports
import fs from 'fs';

export namespace DockerCompose {
  export function destroy(options?: ExecSyncOptions) {
    execSync(`docker-compose stop`, options);
    execSync(`docker-compose rm -fv`, options);
    fs.rmSync(`${process.env.HOME}/.esback-e2e/bitbucket`, {
      force: true,
      recursive: true,
    });
  }

  export function up(name: string, options?: ExecSyncOptions) {
    execSync(`docker-compose up -d ${name}`, options);
  }
}
