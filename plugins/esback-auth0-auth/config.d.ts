import { LoginPageConfig } from "@esback/plugin-login";

interface Auth0LoginPageConfig extends LoginPageConfig {
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