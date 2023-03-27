import { Vault } from './vault';

enum ServerType {
  bitbucketServer,
  esback,
  cypress,
}

async function buildEnvironment(serverType: ServerType) {
  const vault = Vault.build();
  switch (serverType) {
    case ServerType.bitbucketServer:
      return {
        // TODO: ESBACK-214 - Use this BITBUCKET_SERVER_LICENSE_KEY environment variable to select the key based
        // on the context (local dev or pipeline)
        BITBUCKET_SERVER_LICENSE: await vault.readE2ESecret(
          process.env.BITBUCKET_SERVER_LICENSE_KEY ||
            'bitbucket_server_license_dev',
        ),
      };
    case ServerType.esback:
      return {
        OKTA_CLIENT_ID: await vault.readOktaSecret('client_id'),
        OKTA_CLIENT_SECRET: await vault.readOktaSecret('client_secret'),
        OKTA_AUDIENCE: await vault.readOktaSecret('audience'),
        GITHUB_ENTERPRISE_TOKEN: await vault.readE2ESecret(
          'github_enterprise_token',
        ),
        GITHUB_TOKEN: await vault.readE2ESecret('github_token'),
        AZURE_TOKEN: await vault.readE2ESecret('azure_token'),
        AZURE_TENANT_ID: await vault.readE2ESecret('azure_tenant_id'),
        AZURE_CLIENT_ID: await vault.readE2ESecret('azure_client_id'),
        AZURE_CLIENT_SECRET: await vault.readE2ESecret('azure_client_secret'),
        GITLAB_TOKEN: await vault.readGitlabSecret('fixtures_token'),
        BITBUCKET_CLIENT_ID: await vault.readBitbucketSecret('client_id'),
        BITBUCKET_CLIENT_SECRET: await vault.readBitbucketSecret(
          'client_secret',
        ),
        BITBUCKET_HOST: process.env.BITBUCKET_HOST || 'bitbucket:7990',
        LDAP_ENDPOINT: process.env.LDAP_ENDPOINT || 'ldap://openldap:1389',
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
        GKE_OIDC_CLIENT_ID: await vault.readGkeOidcSecret('client_id'),
        GKE_OIDC_CLIENT_SECRET: await vault.readGkeOidcSecret('client_secret'),
        AUTH0_CLIENT_ID: await vault.readAuth0Secret('client_id'),
        AUTH0_CLIENT_SECRET: await vault.readAuth0Secret('client_secret'),
        AUTH0_DOMAIN: await vault.readAuth0Secret('domain'),
        GITHUB_APP_CLIENT_ID: await vault.readE2ESecret('github_app_client_id'),
        GITHUB_APP_CLIENT_SECRET: await vault.readE2ESecret(
          'github_app_client_secret',
        ),
        AWS_ACCESS_KEY_ID: await vault.readE2ESecret('aws_access_key_id'),
        AWS_SECRET_ACCESS_KEY: await vault.readE2ESecret(
          'aws_secret_access_key',
        ),
        NODE_TLS_REJECT_UNAUTHORIZED: 0,
      };
    case ServerType.cypress:
      return {
        CYPRESS_BITBUCKET_HOST: 'localhost:7990',
        CYPRESS_BITBUCKET_CATALOG_PREFIX:
          process.env.BITBUCKET_CATALOG_PREFIX || 'bitbucket:7990',
        CYPRESS_BITBUCKET_JOHN_DOE_REFRESH_TOKEN: await vault.readE2ESecret(
          'bitbucket_john_doe_refresh_token',
        ),
        CYPRESS_AUTH0_REFRESH_TOKEN: await vault.readE2ESecret(
          'auth0_refresh_token',
        ),
        CYPRESS_GOOGLE_USER_A_REFRESH_TOKEN: await vault.readE2ESecret(
          'google_user_a_refresh_token',
        ),
        CYPRESS_OKTA_REFRESH_TOKEN: await vault.readE2ESecret(
          'okta_refresh_token',
        ),
        CYPRESS_GITHUB_USER_REFRESH_TOKEN: await vault.readE2ESecret(
          'github_user_refresh_token',
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

const server: ServerType =
  ServerType[process.argv[2] as keyof typeof ServerType];
buildEnvironment(server).then(env => shellFormat(env));
