import '@backstage/cli/asset-types';
import { AppRuntime } from '@esback/runtime';
import { plugin as helloWorldPlugin } from '@esback/plugin-hello-world';

new AppRuntime([helloWorldPlugin()]).render();
