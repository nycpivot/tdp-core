import { Vault } from './vault';

enum ServerType {
  bitbucketServer,
  tpb,
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
    case ServerType.tpb:
      return {
        OKTA_CLIENT_ID: await vault.readOktaSecret('svc_tpb_client_id'),
        OKTA_CLIENT_SECRET: await vault.readOktaSecret('svc_tpb_client_secret'),
        OKTA_AUDIENCE: await vault.readOktaSecret('svc_tpb_audience'),
        GITHUB_ENTERPRISE_TOKEN: await vault.readE2ESecret(
          'github_enterprise_token',
        ),
        GITHUB_TOKEN: await vault.readE2ESecret('github_token'),
        AZURE_TOKEN: await vault.readE2ESecret('azure_token'),
        AZURE_TENANT_ID: await vault.readE2ESecret('azure_tenant_id'),
        AZURE_CLIENT_ID: await vault.readE2ESecret('azure_client_id'),
        AZURE_CLIENT_SECRET: await vault.readE2ESecret('azure_client_secret'),
        GITLAB_TOKEN: await vault.readGitlabSecret('fixtures_token'),
        BITBUCKET_CLIENT_ID: await vault.readBitbucketSecret(
          'svc_tpb_loopback_client_id',
        ),
        BITBUCKET_CLIENT_SECRET: await vault.readBitbucketSecret(
          'svc_tpb_loopback_client_secret',
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
        GKE_OIDC_CLIENT_ID: await vault.readGkeOidcSecret('svc_tpb_client_id'),
        GKE_OIDC_CLIENT_SECRET: await vault.readGkeOidcSecret(
          'svc_tpb_client_secret',
        ),
        AUTH0_CLIENT_ID: await vault.readAuth0Secret('svc_tpb_client_id'),
        AUTH0_CLIENT_SECRET: await vault.readAuth0Secret(
          'svc_tpb_client_secret',
        ),
        AUTH0_DOMAIN: await vault.readAuth0Secret('svc_tpb_domain'),
        GITHUB_APP_CLIENT_ID: await vault.readGithubSecret(
          'svc_tpb_loopback_client_id',
        ),
        GITHUB_APP_CLIENT_SECRET: await vault.readGithubSecret(
          'svc_tpb_loopback_client_secret',
        ),
        AWS_ACCESS_KEY_ID: await vault.readE2ESecret('aws_access_key_id'),
        AWS_SECRET_ACCESS_KEY: await vault.readE2ESecret(
          'aws_secret_access_key',
        ),
        VMWARE_CLOUD_SERVICES_CLIENT_ID: await vault.readE2ESecret(
          'vmware_cloud_services_client_id',
        ),
        VMWARE_CLOUD_SERVICES_ORGANIZATION_ID: await vault.readE2ESecret(
          'vmware_cloud_services_organization_id',
        ),
        BACKEND_SECRET: await vault.readE2ESecret('backend_secret'),
        APP_ACCELERATOR_HOST: await vault.readAppAcceleratorSecret('host'),
        NODE_TLS_REJECT_UNAUTHORIZED: 0,
      };
    case ServerType.cypress:
      return {
        CYPRESS_BITBUCKET_HOST: 'localhost:7990',
        CYPRESS_BITBUCKET_CATALOG_PREFIX:
          process.env.BITBUCKET_CATALOG_PREFIX || 'bitbucket:7990',
        CYPRESS_BITBUCKET_SVC_TPB_REFRESH_TOKEN: await vault.readE2ESecret(
          'bitbucket_loopback_svc_tpb_refresh_token',
        ),
        CYPRESS_AUTH0_SVC_TPB_REFRESH_TOKEN: await vault.readE2ESecret(
          'auth0_svc_tpb_refresh_token',
        ),
        CYPRESS_GOOGLE_SVC_TPB_INSUFFICIENT_SCOPE_REFRESH_TOKEN:
          await vault.readE2ESecret(
            'google_svc_tpb_insufficient_scope_refresh_token',
          ),
        CYPRESS_GOOGLE_SVC_TPB_REFRESH_TOKEN: await vault.readE2ESecret(
          'google_svc_tpb_refresh_token',
        ),
        CYPRESS_OKTA_SVC_TPB_REFRESH_TOKEN: await vault.readE2ESecret(
          'okta_svc_tpb_refresh_token',
        ),
        CYPRESS_GITHUB_SVC_TPB_REFRESH_TOKEN: await vault.readE2ESecret(
          'github_svc_tpb_refresh_token',
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
