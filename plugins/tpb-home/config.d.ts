interface QuickLink {
  url: string;
  label: string;
  // label: string;
  // icon?: string;
}

export interface Config {
  customize?: {
    features?: {
      home?: {
        /**
         * base64 encodes SVG image.
         * @visibility frontend
         */
        logo?: string;
        /**
         * @visibility frontend
         */
        quickLinks?: {
          /**
           * @visibility frontend
           */
          url: string;
          /**
           * @visibility frontend
           */
          label: string;
          /**
           * @visibility frontend
           */
          icon?: string;
        }[];
      };
    };
  };
}
