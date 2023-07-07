export interface Config {
  customize?: {
    features?: {
      home?: {
        /**
         * base64 encoded SVG image.
         * @visibility frontend
         */
        logo?: string;
        /**
         * @visibility frontend
         */
        welcomeMessage?: string;
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
           * base64 encoded SVG image.
           * @visibility frontend
           */
          icon?: string;
        }[];
      };
    };
  };
}
