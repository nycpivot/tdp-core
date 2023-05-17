import {
  OAuthHandlers,
  OAuthResponse,
  OAuthStartRequest,
  OAuthStartResponse,
} from '@backstage/plugin-auth-backend';
import express from 'express';

export class VMwareCloudServicesAuthProvider implements OAuthHandlers {
  async start(_: OAuthStartRequest): Promise<OAuthStartResponse> {
    return { url: '' };
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
