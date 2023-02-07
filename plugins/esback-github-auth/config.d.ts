import { LoginPageConfig } from "@esback/plugin-login";

interface GithubLoginPageConfig extends LoginPageConfig {
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
      github?: GithubLoginPageConfig
    }
  };
}