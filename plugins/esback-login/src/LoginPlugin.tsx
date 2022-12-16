import React from 'react';
import { AppComponentSurface, AppPluginInterface } from '@esback/core';
import { SignInPage } from '@backstage/core-components';
import { LoginSurface } from './LoginSurface';

export const LoginPlugin: AppPluginInterface = () => {
  return context => {
    context.applyWithDependency(
      AppComponentSurface,
      LoginSurface,
      (appComponentSurface, loginSurface) => {
        // if(loginSurface.allProviders().length > 0) { // TODO: uncomment if we want to allow
        appComponentSurface.add('SignInPage', props => {
          return (
            <SignInPage {...props} providers={loginSurface.allProviders()} />
          );
        });
        // }
      },
    );
  };
};
