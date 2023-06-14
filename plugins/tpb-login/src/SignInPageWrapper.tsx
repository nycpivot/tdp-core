import React from 'react';
import { LoginSurface } from './LoginSurface';
import {
  SignInPageProps,
  configApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { SignInPage } from '@backstage/core-components';

type SignInPageWrapperProps = SignInPageProps & { loginSurface: LoginSurface };

export function SignInPageWrapper({
  loginSurface,
  ...signInPageProps
}: SignInPageWrapperProps) {
  const configApi = useApi(configApiRef);

  const enabledProviders = loginSurface.enabledProviders(configApi);
  if (enabledProviders.length === 0) {
    return <SignInPage {...signInPageProps} providers={['guest']} />;
  }
  // TODO: ESBACK-163 - needs test for case when there are login providers, but none are configured
  return <SignInPage {...signInPageProps} providers={enabledProviders} />;
}
