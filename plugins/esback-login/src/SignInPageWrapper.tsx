import React from 'react';
import { LoginSurface } from './LoginSurface';
import {
  SignInPageProps,
  configApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { SignInPage } from '@backstage/core-components';

type SignInPageWrapperProps = SignInPageProps & { loginSurface: LoginSurface };

export function SignInPageWrapper(props: SignInPageWrapperProps) {
  const configApi = useApi(configApiRef);

  const enabledProviders = props.loginSurface.enabledProviders(configApi);
  if (enabledProviders.length > 0) {
    return <SignInPage {...props} providers={enabledProviders} />;
  }
  // TODO: ESBACK-163 - needs test for case when there are login providers, but none are configured
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      No configured authentication providers. Please configure at least one.
    </div>
  );
}
