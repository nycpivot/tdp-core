/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  ConfigApi,
  configApiRef,
  gitlabAuthApiRef,
} from '@backstage/core-plugin-api';
import {
  MockConfigApi,
  TestApiProvider,
  renderInTestApp,
} from '@backstage/test-utils';
import React from 'react';
import { LoginSurface, customizeAuthProviderConfig } from './LoginSurface';
import { SignInPageWrapper } from './SignInPageWrapper';

describe('SignInPageWrapper component', () => {
  describe('A guest provider is added to the login surface', () => {
    it('renders guest card even when no providers are enabled', async () => {
      const fakeConfig = new MockConfigApi({
        app: {
          title: 'Test App',
        },
        backend: { baseUrl: 'http://localhost:7000' },
      });

      const loginSurface = new LoginSurface();
      loginSurface.add({
        config: () => 'guest',
        enabled: (configApi: ConfigApi) =>
          configApi.getOptionalBoolean('auth.allowGuestAccess') ?? false,
        authProviderKey: 'guest',
      });

      const { queryByText } = await renderInTestApp(
        <TestApiProvider apis={[[configApiRef, fakeConfig]]}>
          <SignInPageWrapper
            onSignInSuccess={() => {}}
            loginSurface={loginSurface}
          />
        </TestApiProvider>,
      );

      expect(queryByText('Guest')).toBeInTheDocument();
      expect(queryByText('Enter')).toBeInTheDocument();
    });
  });

  describe('Several providers are added to the login surface', () => {
    const gitlabAuthProviderKey = 'gitlab';
    let loginSurface: LoginSurface;

    beforeEach(() => {
      loginSurface = new LoginSurface();
      loginSurface.add({
        config: () => 'guest',
        enabled: (configApi: ConfigApi) =>
          configApi.getOptionalBoolean('auth.allowGuestAccess') ?? false,
        authProviderKey: 'guest',
      });

      loginSurface.add({
        config: (configApi: ConfigApi) => ({
          ...customizeAuthProviderConfig(
            configApi,
            {
              id: 'gitlab-auth-provider',
              title: 'GitLab',
              message: 'Sign in with GitLab',
            },
            gitlabAuthProviderKey,
          ),
          apiRef: gitlabAuthApiRef,
        }),
        enabled: (configApi: ConfigApi) =>
          configApi.has(`auth.providers.${gitlabAuthProviderKey}`),
        authProviderKey: gitlabAuthProviderKey,
      });
    });

    describe('only the gitlab card is enabled', () => {
      it('renders only the gitlab card that is enabled', async () => {
        const fakeConfig = new MockConfigApi({
          app: {
            title: 'Test App',
          },
          backend: { baseUrl: 'http://localhost:7000' },
          auth: {
            environment: 'development',
            providers: {
              gitlab: {
                development: {
                  clientId: 'fakeId',
                  clientSecret: 'fakeSecret',
                },
              },
            },
          },
        });

        const { getByText, queryByText } = await renderInTestApp(
          <TestApiProvider
            apis={[
              [configApiRef, fakeConfig],
              [gitlabAuthApiRef, fakeAuthApi],
            ]}
          >
            <SignInPageWrapper
              onSignInSuccess={() => {}}
              loginSurface={loginSurface}
            />
          </TestApiProvider>,
        );

        expect(getByText('GitLab')).toBeInTheDocument();
        expect(getByText('Sign In')).toBeInTheDocument();

        expect(queryByText('Guest')).not.toBeInTheDocument();
      });
    });

    describe('both the gitlab and guest auth providers are enabled', () => {
      it('renders only the cards that are enabled', async () => {
        const fakeConfig = new MockConfigApi({
          app: {
            title: 'Test App',
          },
          backend: { baseUrl: 'http://localhost:7000' },
          auth: {
            allowGuestAccess: true,
            environment: 'development',
            providers: {
              gitlab: {
                development: {
                  clientId: 'fakeId',
                  clientSecret: 'fakeSecret',
                },
              },
            },
          },
        });

        const { getByText } = await renderInTestApp(
          <TestApiProvider
            apis={[
              [configApiRef, fakeConfig],
              [gitlabAuthApiRef, fakeAuthApi],
            ]}
          >
            <SignInPageWrapper
              onSignInSuccess={() => {}}
              loginSurface={loginSurface}
            />
          </TestApiProvider>,
        );

        expect(getByText('GitLab')).toBeInTheDocument();
        expect(getByText('Sign In')).toBeInTheDocument();

        expect(getByText('Guest')).toBeInTheDocument();
        expect(getByText('Enter')).toBeInTheDocument();
      });
    });
  });
});

const fakeAuthApi = {
  getAccessToken: async () => 'misterToken',
};
