import { LoginPageConfig } from "@esback/plugin-login";

export class OneLoginLoginPageConfig implements LoginPageConfig {
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
      onelogin?: OneLoginLoginPageConfig
    }
  };
}