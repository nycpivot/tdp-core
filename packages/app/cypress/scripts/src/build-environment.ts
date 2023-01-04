import { Vault } from './vault';
import { Git } from './git';

enum ServerType {
  Bitbucket = 'bitbucket-server',
  Esback = 'esback',
}

async function buildEnvironment(serverType: ServerType) {
  const vault = Vault.build();
  switch (serverType) {
    case ServerType.Bitbucket:
      return {
        BITBUCKET_SERVER_LICENSE: await vault.readE2ESecret(
          'bitbucket_server_license',
        ),
      };
    case ServerType.Esback:
      return {
        GITHUB_ENTERPRISE_TOKEN: await vault.readE2ESecret(
          'github_enterprise_token',
        ),
        GITHUB_TOKEN: await vault.readE2ESecret('github_token'),
        GITLAB_TOKEN: await vault.readGitlabSecret('core_token'),
        GIT_BRANCH: Git.currentBranch(),
        GKE_CONTROL_PLANE_ENDPOINT: await vault.readGkeSecret(
          'control_plane_endpoint',
        ),
        GKE_APP_LIVE_VIEW_ENDPOINT: await vault.readGkeSecret(
          'app_live_view_endpoint',
        ),
        GKE_SERVICE_ACCOUNT_TOKEN: await vault.readGkeSecret(
          'service_account_token',
        ),
        GKE_OIDC_CONTROL_PLANE_ENDPOINT: await vault.readGkeOidcSecret(
          'control_plane_endpoint',
        ),
        GKE_OIDC_CLIENT_ID: await vault.readGkeOidcSecret(
          'client_id',
        ),
        GKE_OIDC_CLIENT_SECRET: await vault.readGkeOidcSecret(
          'client_secret',
        ),
      };
    default:
      throw new Error(`Unknown server ${serverType}`);
  }
}

function shellFormat(env: any) {
  for (const [key, value] of Object.entries(env)) {
    process.stdout.write(`export ${key}=${value}\n`);
  }
}

if (process.argv.length !== 3) {
  process.stderr.write(
    'Provide which environment server you are interested in.',
  );
  process.exit(1);
}

const server =
  process.argv[2] === 'bitbucket' ? ServerType.Bitbucket : ServerType.Esback;
buildEnvironment(server).then(env => shellFormat(env));
