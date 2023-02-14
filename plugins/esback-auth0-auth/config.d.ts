export interface Config {
  auth?: {
    /**
     * @visibility frontend
     */
    loginPage?: {
      auth0?: {
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
      };
    };
  };
}
