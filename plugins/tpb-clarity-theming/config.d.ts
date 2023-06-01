export interface Config {
  customize?: {
    /**
     * @visibility frontend
     */
    custom_logo?: string;

    /**
     * @visibility frontend
     */
    custom_name?: string;

    banners?: {
      /**
       * Text for the banners.
       * Default empty, hide the banner
       * @visibility frontend
       */
      text?: string;
      /**
       * Color for the banners.
       * Default #FFFFFF
       * @visibility frontend
       */
      color?: string;
      /**
       * Background Color for the banners.
       * Default #c23b2e
       * @visibility frontend
       */
      bg?: string;
      /**
       * Link for the banners.
       * @visibility frontend
       */
      link?: string;
      /**
       * Text for the banner links.
       * Default Read more
       * @visibility frontend
       */
      linkText?: string;
    };
  };
}
