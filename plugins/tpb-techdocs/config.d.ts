export interface Config {
  customize?: {
    features?: {
      docs?: {
        /**
         * Show or hide the sidebar entry. Default: true
         * @visibility frontend
         */
        showInSidebar?: boolean;
      };
    };
  };
}
