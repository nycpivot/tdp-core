export interface Config {
  customize?: {
    features?: {
      catalog?: {
        /**
         * Show or hide the sidebar entry. Default: true
         * @visibility frontend
         */
        showInSidebar?: boolean;
      };
    };
  };
}
