export interface Config {
  customize?: {
    features?: {
      settings?: {
        /**
         * Activate or deactivate the plugin? Default: true
         * @visibility frontend
         */
        enabled?: boolean;
      };
    };
    /**
     * Set the route to navigate to after logging in. Default: 'catalog'
     * @visibility frontend
     */
    default_route?: string;
  };
}
