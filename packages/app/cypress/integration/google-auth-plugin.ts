import { Authentication } from '../support/authentication';

describe('Google Auth Plugin', () => {
  it('should display the sign in button', () => {
    cy.visit('/');
    cy.contains(/sign in with google oauth/i);
    cy.contains('li', /google/i)
      .contains(/sign in/i)
      .should('be.visible');
  });

  it('should display user email in the settings', () => {
    Authentication.googleUserALogin();
    cy.visit('/settings');
    cy.contains('esback.e2e.usera@gmail.com').should('be.visible');
  });
});
