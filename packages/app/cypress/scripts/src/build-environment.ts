import { Vault } from './vault';
import { Git } from './git';

async function buildEnvironment() {
  const vault = Vault.build();
  return {
    BITBUCKET_SERVER_LICENSE: await vault.readE2ESecret(
      'bitbucket_server_license',
    ),
    GITHUB_ENTERPRISE_TOKEN: await vault.readE2ESecret(
      'github_enterprise_token',
    ),
    GITHUB_TOKEN: await vault.readE2ESecret('github_token'),
    GITLAB_TOKEN: await vault.readGitlabSecret('core_token'),
    GIT_BRANCH: Git.currentBranch(),
  };
}

function shellFormat(env: any) {
  for (const [key, value] of Object.entries(env)) {
    process.stdout.write(`export ${key}=${value}\n`);
  }
}

buildEnvironment().then(env => shellFormat(env));
