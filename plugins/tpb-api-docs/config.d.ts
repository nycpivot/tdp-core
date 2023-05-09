export interface Config {
  customize?: {
    features?: {
      apiDocs?: {
        /**
         * Show or hide the sidebar entry. Default: true
         * @visibility frontend
         */
        showInSidebar?: boolean;
      };
    };
  };
}
