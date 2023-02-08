import { LoginPageConfig } from "@esback/plugin-login";

export class GitlabLoginPageConfig implements LoginPageConfig {
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
      gitlab?: GitlabLoginPageConfig
    }
  };
}