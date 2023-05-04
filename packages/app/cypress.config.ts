import { defineConfig } from 'cypress';

export default defineConfig({
  fixturesFolder: 'cypress/fixtures',
  retries: 3,
  viewportWidth: 2400,
  viewportHeight: 2000,
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:3000',
  },
});
