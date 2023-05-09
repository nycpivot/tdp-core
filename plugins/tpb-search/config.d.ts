export interface Config {
  customize?: {
    features?: {
      search?: {
        /**
         * Show or hide the sidebar entry. Default: true
         * @visibility frontend
         */
        showInSidebar?: boolean;
      };
    };
  };
}
