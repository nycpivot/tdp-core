import { BackendPluginInterface } from '@tpb/core-backend';
import { LoggerOptionsSurface } from './LoggerOptionsSurface';
import { CustomLoggerOptions } from './CustomLoggerOptions';

export const CustomLoggerPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(LoggerOptionsSurface, surface => {
    surface.setLoggerOptions(CustomLoggerOptions);
  });
};
