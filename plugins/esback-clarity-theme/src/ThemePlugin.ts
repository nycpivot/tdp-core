import { AppPluginInterface, ThemeSurface } from '@esback/core';
import { ClarityDark } from './ClarityDark';
import { ClarityLight } from './ClarityLight';

export const ThemePlugin: AppPluginInterface = () => {
  return context => {
    context.applyTo(ThemeSurface, surface => {
      surface.addTheme(ClarityLight);
      surface.addTheme(ClarityDark);
    });
  };
};
