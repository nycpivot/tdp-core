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
  };
}
