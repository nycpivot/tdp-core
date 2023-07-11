import { Authentication } from '../support/authentication';

describe('Backstage Home plugin v0.5.3 in TPB v1.6.0', () => {
  beforeEach(() => {
    localStorage.clear();
    Authentication.logInAsCatalogAdmin();
    cy.visit('/');
    cy.get('a[aria-label="Home page"]').should('be.be.visible').click();
  });

  it('should display the home page edit widget and allow setting defaults', () => {
    cy.visit('/home');
    cy.get('button').contains('Edit').click();
    cy.get('button').contains('Add widget').click();
    cy.get('h2').contains('Add new widget to dashboard').should('be.visible');
    cy.get('div[role="button"]').contains('CompanyLogo').should('be.visible');
    cy.get('div[role="button"]')
      .contains('HomePageWelcomeMessage')
      .should('be.visible');
    cy.get('div[role="button"]')
      .contains('Your Starred Entities')
      .should('be.visible');
    cy.get('div[role="button"]')
      .contains('Toolkit')
      .should('be.visible')
      .click();
    cy.get('button').contains('Restore defaults').click();
    cy.get('button').contains('Save').click();
  });

  it('should display the default widgets', () => {
    cy.visit('/home');
    cy.get('img[alt="Company Logo').should('be.visible');
    cy.get('h1').contains('Hello, dev!').should('be.visible');
    cy.get('div').contains('Your Starred Entities').should('be.visible');
    cy.get('div').contains('Quick Links').should('be.visible');
    cy.get('a[href="https://google.com"]')
      .contains('google')
      .should('be.visible');
  });
});
