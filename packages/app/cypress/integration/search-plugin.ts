import { Authentication } from '../support/authentication';

describe('Search Plugin', () => {
  beforeEach(() => {
    Authentication.guestLogin();
  });

  it('displays the search page', () => {
    cy.visit('/search');
    cy.contains('Results per page:');
  });

  it('displays the search modal', () => {
    cy.visit('/');
    cy.get('[aria-label="Search"]').first().click();
    cy.get('[role="dialog"]').should('be.visible');
  });

  it('retains search terms on transition from modal to full search page', () => {
    cy.visit('/');
    cy.get('[aria-label="Search"]').first().click();

    cy.get('[role="dialog"]')
      .first()
      .within(() => {
        cy.get('input[type="text"][aria-label="Search"]').type(
          'example-website',
        );
        cy.contains('View Full Results').click();
      });

    cy.url().should('include', '/search');
  });
});
