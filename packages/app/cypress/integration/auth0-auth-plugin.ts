import { Authentication } from '../support/authentication';

describe('Auth0 Plugin', () => {
  it('should display the sign in button', () => {
    cy.visit('/');
    cy.contains(/sign in with auth0/i);
    cy.contains('li', /auth0/i)
      .contains(/sign in/i)
      .should('be.visible');
  });

  it('should display user email in the settings', () => {
    Authentication.auth0Login();
    cy.visit('/settings');
    cy.contains('esback.e2e@vmware.com');
  });
});
