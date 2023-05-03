export interface Config {
  auth?: {
    /**
     * @visibility frontend
     */
    loginPage?: {
      'permission-test'?: {
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
