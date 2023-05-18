import {
  OAuthHandlers,
  OAuthResponse,
  OAuthStartRequest,
  OAuthStartResponse,
} from '@backstage/plugin-auth-backend';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import express from 'express';

export class VMwareCloudServicesAuthProvider implements OAuthHandlers {
  private readonly clientId: string;
  private readonly callbackUrl: string;

  constructor(options: { clientId: string; callbackUrl: string }) {
    this.clientId = options.clientId;
    this.callbackUrl = options.callbackUrl;
  }

  start(oauthStartRequest: OAuthStartRequest): Promise<OAuthStartResponse> {
    return new Promise((resolve, reject) => {
      const strategy = new OAuth2Strategy(
        {
          clientID: this.clientId,
          clientSecret: '',
          callbackURL: this.callbackUrl,
          authorizationURL:
            'https://console.cloud.vmware.com/csp/gateway/discovery',
          tokenURL: 'slime',
          pkce: true,
          state: true,
        },
        () => {},
      );

      strategy.redirect = (url: string, status?: number) => {
        resolve({ url, status: status ?? undefined });
      };
      strategy.error = (error: Error) => {
        reject(error);
      };
      strategy.authenticate(oauthStartRequest);
    });
  }

  async handler(
    _: express.Request,
  ): Promise<{ response: OAuthResponse; refreshToken?: string }> {
    return {
      response: {
        profile: {},
        providerInfo: { accessToken: '', scope: '' },
      },
    };
  }
}
