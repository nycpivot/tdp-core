export interface Config {
  auth?: {
    /**
     * @visibility frontend
     */
    loginPage?: {
      okta?: {
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
