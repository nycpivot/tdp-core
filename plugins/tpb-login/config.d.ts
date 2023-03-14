export interface Config {
  auth?: {
    /**
     * @visibility frontend
     */
    allowGuestAccess?: boolean;
    /**
     * @visibility frontend
     */
    loginPage?: {};
  };
}
