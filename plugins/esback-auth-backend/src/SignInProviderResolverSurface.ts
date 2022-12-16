import {
  AuthProviderConfig,
  AuthResolverContext,
} from '@backstage/plugin-auth-backend';
import { Config } from '@backstage/config';
import winston from 'winston';

export type SignInProvider = {
  options: {
    providerId: string;
    globalConfig: AuthProviderConfig;
    config: Config;
    logger: winston.Logger;
    resolverContext: AuthResolverContext;
  };
};

export class SignInProviderResolverSurface {
  private _signInProvidersResolvers = {};

  public add(signInProvider: SignInProvider) {
    this._signInProvidersResolvers = {
      ...signInProvider,
      ...this._signInProvidersResolvers,
    };
  }

  public allSignInProviders() {
    return this._signInProvidersResolvers;
  }
}
