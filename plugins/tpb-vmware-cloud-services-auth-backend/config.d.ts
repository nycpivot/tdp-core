export interface Config {
  auth?: {
    /**
     * @additionalProperties true
     */
    providers?: {
      vmwareCloudServices?: {
        [authEnv: string]: {
          /**
           * @visibility secret
           */
          clientId: string;
          organizationId?: string;
        };
      };
    };
  };
}
