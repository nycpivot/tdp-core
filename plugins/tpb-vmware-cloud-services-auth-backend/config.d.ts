export interface Config {
  auth?: {
    /**
     * @additionalProperties true
     */
    providers?: {
      vmwareCloudServices?: {
        clientId: string;

        /**
         * @visibility secret
         */
        clientSecret: string;
        organizationId: string;
        consoleEndpoint: string;
      };
    };
  };
}
