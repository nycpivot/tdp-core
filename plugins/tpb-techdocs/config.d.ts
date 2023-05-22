export interface Config {
  customize?: {
    features?: {
      docs?: {
        /**
         * Activate or deactivate the plugin? Default: true
         * @visibility frontend
         */
        enabled?: boolean;

        /**
         * Show or hide the sidebar entry. Default: true
         * @visibility frontend
         */
        showInSidebar?: boolean;
      };
    };
  };
}
