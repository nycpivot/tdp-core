import { Authentication } from '../support/authentication';

describe('Okta Auth plugin', () => {
  it('should display the sign in button', () => {
    cy.visit('/');
    cy.contains(/sign in with okta/i);
    cy.contains('li', /okta/i)
      .contains('button', /sign in/i)
      .should('be.visible');
  });

  it("should display user's email & name in the settings", () => {
    Authentication.oktaLogin();
    cy.visit('/settings');
    cy.contains(/svc tpb/i).should('be.visible');
    cy.contains('svc.tpb@vmware.com').should('be.visible');
  });
});
