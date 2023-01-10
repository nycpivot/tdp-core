import React from 'react';
import { AppComponentSurface, AppPluginInterface } from '@esback/core';
import { SignInPage } from '@backstage/core-components';
import { LoginSurface } from './LoginSurface';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export const LoginPlugin: AppPluginInterface = () => {
  return context => {
    context.applyWithDependency(
      AppComponentSurface,
      LoginSurface,
      (appComponentSurface, loginSurface) => {
        if (loginSurface.hasProviders()) {
          appComponentSurface.add('SignInPage', props => {
            const enabledProviders = loginSurface.enabledProviders(
              useApi(configApiRef), // eslint-disable-line react-hooks/rules-of-hooks
            );
            if (enabledProviders.length > 0) {
              return <SignInPage {...props} providers={enabledProviders} />;
            }
            return (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                No configured authentication providers. Please configure at
                least one in your app-config.yaml
              </div>
            );
          });
        }
      },
    );
  };
};
