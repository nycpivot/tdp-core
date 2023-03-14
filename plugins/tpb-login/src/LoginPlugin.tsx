import React from 'react';
import { AppComponentSurface, AppPluginInterface } from '@tpb/core';
import { LoginSurface } from './LoginSurface';
import { SignInPageWrapper } from './SignInPageWrapper';

export const LoginPlugin: AppPluginInterface = () => {
  return context => {
    context.applyWithDependency(
      AppComponentSurface,
      LoginSurface,
      (appComponentSurface, loginSurface) => {
        // TODO: ESBACK-163 - needs test for case when there are no login providers
        if (loginSurface.hasProviders()) {
          appComponentSurface.add('SignInPage', props => {
            return (
              <SignInPageWrapper
                onSignInSuccess={props.onSignInSuccess}
                loginSurface={loginSurface}
              />
            );
          });
        }
      },
    );
  };
};
