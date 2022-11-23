import { Vault } from './vault';
import { BitbucketServer } from './bitbucket-server';
import { Git } from './git';
import { DockerCompose } from './docker-compose';

async function startContainers() {
  const env = await buildEnvironment();
  const options = { env: env };

  DockerCompose.destroy(options);
  DockerCompose.up('bitbucket', options);
  const token = await BitbucketServer.generateToken();
  process.stdout.write(`Generated token for bitbucket token: ${token}`);
  DockerCompose.up('esback', {
    env: { ...options.env, BITBUCKET_TOKEN: token },
  });
}

async function buildEnvironment() {
  const vault = Vault.build();
  return {
    ...process.env,
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

startContainers().then(r => process.stdout.write('Containers started\n\n'));
