import { Authentication } from '../support/authentication';

describe('Okta Auth plugin', () => {
  it('should display the sign in button', () => {
    cy.visit('/');
    cy.contains(/sign in with okta/i);
    cy.contains('li', /okta/i)
      .contains(/sign in/i)
      .should('be.visible');
  });

  it("should display user's email & name in the settings", () => {
    Authentication.oktaLogin();
    cy.visit('/settings');
    cy.contains(/john doe/i).should('be.visible');
    cy.contains('esback.e2e@gmail.com').should('be.visible');
  });
});
