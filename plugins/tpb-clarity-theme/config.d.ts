export interface Config {
  customize?: {
    features?: {
      settings?: {
        /**
         * Show or hide the sidebar entry. Default: true
         * @visibility frontend
         */
        showInSidebar?: boolean;
      };
    };
  };
}
