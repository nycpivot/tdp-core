import { Authentication } from '../support/authentication';

describe('Backstage Stack Overflow plugin v0.1.17 in TPB v1.6.0', () => {
  beforeEach(() => {
    localStorage.clear();
    Authentication.logInAsCatalogAdmin();
  });

  it('should be allowed to be added using the homepage edit widget', () => {
    cy.visit('/home');
    cy.get('button').contains('Edit').click();
    cy.get('button').contains('Add widget').click();
    cy.get('h2').contains('Add new widget to dashboard').should('be.visible');
    cy.get('div[role="button"]')
      .contains('Stack Overflow Questions')
      .should('be.visible')
      .click();
    cy.get('button').contains('Restore defaults').click();
    cy.get('button').contains('Save').click();
    cy.get('div').contains('Stack Overflow Questions').should('be.visible');
  });
});
