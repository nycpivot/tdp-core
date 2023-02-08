import { LoginPageConfig } from "@esback/plugin-login";

export class Auth0LoginPageConfig implements LoginPageConfig {
  /**
  * @visibility frontend
  */
  id?: string;

  /**
  * @visibility frontend
  */
  title?: string;

  /**
  * @visibility frontend
  */
  message?: string;
}

export interface Config {
  auth?: {
  /**
  * @visibility frontend
  */
    loginPage?: {
      auth0?: Auth0LoginPageConfig
    }
  };
}