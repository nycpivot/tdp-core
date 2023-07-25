import { Authentication } from '../support/authentication';

describe('GitHub Actions v0.6.0 in TPB v1.6.0', () => {
  beforeEach(() => {
    Authentication.githubLogin();
    cy.visit('/catalog');
  });

  it('displays the GitHub Actions tab on an entity details', () => {
    cy.contains('Catalog');
    cy.contains('example-service');
    cy.get('td[value="example-service"]').should('be.visible');
  });

  it('displays the workflows table', () => {
    cy.contains('Catalog');
    cy.contains('example-service');

    cy.get('td[value="example-service"]')
      .should('be.visible')
      .children('a')
      .click();

    cy.get('button[role="tab"]')
      .contains('GitHub Actions')
      .should('be.visible')
      .click();

    cy.contains('Login Required').should('be.visible');

    cy.get('button')
      .should('be.visible')
      .contains(/log in/i)
      .click();

    cy.contains('svctpb/example-github-actions').should('be.visible');
    cy.contains('ID').should('be.visible');
    cy.contains('Source').should('be.visible');
    cy.contains('Message').should('be.visible');
    cy.contains('Status').should('be.visible');
  });
});
