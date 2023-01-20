import '@backstage/cli/asset-types';
import { AppRuntime } from '@esback/runtime';
import { plugin as helloWorldPlugin } from '@esback/plugin-hello-world';
import { plugin as rrvPlugin } from '@esback/plugin-rrv';
import { plugin as appLiveViewPlugin } from '@esback/plugin-app-live-view';
import { plugin as oktaAuthPlugin } from '@esback/plugin-okta-auth';
import { plugin as azureAuthPlugin } from '@esback/plugin-azure-auth';
import { plugin as githubAuthPlugin } from '@esback/plugin-github-auth';
import { plugin as gitlabAuthPlugin } from '@esback/plugin-gitlab-auth';
import { plugin as googleAuthPlugin } from '@esback/plugin-google-auth';
import { plugin as auth0AuthPlugin } from '@esback/plugin-auth0-auth';
import { plugin as bitbucketAuthPlugin } from '@esback/plugin-bitbucket-auth';
import { plugin as oneLoginAuthPlugin } from '@esback/plugin-onelogin-auth';
import { plugin as guestAuthPlugin } from '@esback/plugin-guest-auth';

new AppRuntime([
  helloWorldPlugin(),
  rrvPlugin(),
  appLiveViewPlugin(),
  oktaAuthPlugin(),
  azureAuthPlugin(),
  githubAuthPlugin(),
  gitlabAuthPlugin(),
  auth0AuthPlugin(),
  bitbucketAuthPlugin(),
  googleAuthPlugin(),
  oneLoginAuthPlugin(),
  guestAuthPlugin(),
]).render();
