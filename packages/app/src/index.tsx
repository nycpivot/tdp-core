import '@backstage/cli/asset-types';
import { AppRuntime } from '@esback/runtime';
import { plugin as helloWorldPlugin } from '@esback/plugin-hello-world';
import { plugin as rrvPlugin } from '@esback/plugin-rrv';
import { plugin as appLiveViewPlugin } from '@esback/plugin-app-live-view';
import { plugin as azureAuthPlugin } from '@esback/plugin-azure-auth';
import { plugin as guestAuthPlugin } from '@esback/plugin-guest-auth';

new AppRuntime([helloWorldPlugin(), rrvPlugin(), appLiveViewPlugin(), azureAuthPlugin(), guestAuthPlugin()]).render();
