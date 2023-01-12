import { Authentication } from '../support/authentication';

describe('Google Auth Plugin', () => {
  it('should display user email in the settings', () => {
    Authentication.googleUserALogin();
    cy.visit('/settings');
    cy.contains('esback.e2e.usera@gmail.com');
  });
});
