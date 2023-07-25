import { createComponentExtension } from '@backstage/core-plugin-api';
import { homePlugin } from '@backstage/plugin-home';

export const HomePageWelcomeMessage = homePlugin.provide(
  createComponentExtension({
    name: 'HomePageWelcomeMessage',
    component: {
      lazy: () => import('./WelcomeMessage').then(m => m.WelcomeMessage),
    },
  }),
);
