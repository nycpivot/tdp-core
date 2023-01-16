import { Authentication } from '../support/authentication';

describe('Bitbucket Auth Plugin', () => {
  it('should display the sign in button', () => {
    cy.visit('/');
    cy.contains(/sign in with bitbucket oauth/i);
    cy.contains('li', /bitbucket/i)
      .contains(/sign in/i)
      .should('be.visible');
  });

  it('should display user identity in the settings', () => {
    Authentication.bitbucketLogin();
    cy.visit('/settings');
    cy.contains('John Doe').should('be.visible');
  });
});
