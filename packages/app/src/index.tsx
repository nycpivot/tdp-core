import '@backstage/cli/asset-types';
import { AppRuntime } from '@esback/runtime';
import { plugin as helloWorldPlugin } from '@esback/plugin-hello-world';
import { plugin as rrvPlugin } from '@esback/plugin-rrv-interface';
import { plugin as appLiveViewPlugin } from '@esback/plugin-app-live-view-interface';

new AppRuntime([helloWorldPlugin(), rrvPlugin(), appLiveViewPlugin()]).render();
