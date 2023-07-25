import { Authentication } from '../support/authentication';

describe('Sonarqube plugin', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
    cy.visit('/catalog');
  });

  it('should render sonarqube-example', () => {
    cy.get('input[placeholder=Filter]').type('sonarqube-example');
    cy.contains('sonarqube-example');
  });

  describe('the user navigates to sonarqube-example component', () => {
    beforeEach(() => {
      cy.get('input[placeholder=Filter]').type('sonarqube-example');
      cy.get('a').contains('sonarqube-example').click({ force: true });
    });

    it('on overview tab', () => {
      cy.get('p').contains('component — website').should('exist');
      cy.get('h1').contains('sonarqube-example').should('exist');
      cy.get('div').contains('About').should('exist');
    });

    it('can see Sonarqube Code Quality card with metrics', () => {
      cy.get('div').contains('Code Quality').should('exist');
      cy.get('a').contains('View more').should('exist');
      cy.get('p').contains('Bugs').should('exist');
      cy.get('p').contains('Vulnerabilities').should('exist');
      cy.get('p').contains('Hotspots Reviewed').should('exist');
      cy.get('p').contains('Code Smells').should('exist');
      cy.get('a').contains('Coverage').should('exist');
      cy.get('a').contains('Duplications').should('exist');
      cy.get('div').contains('Last analyzed on').should('exist');
      cy.get('p')
        .contains('View more')
        .parent()
        .parent()
        .parent()
        .parent()
        .should(
          'have.attr',
          'href',
          'https://sonr-dev.vmware.com/dashboard?id=esback-core',
        );
    });
  });

  describe('the user navigates to example-website component', () => {
    beforeEach(() => {
      cy.get('a').contains('example-website').click({ force: true });
    });

    it('on overview tab', () => {
      cy.get('p').contains('component — website').should('exist');
      cy.get('h1').contains('example-website').should('exist');
      cy.get('div').contains('About').should('exist');
    });

    it('can see Sonarqube Code Quality card with Missing Annotation message', () => {
      cy.get('div').contains('Code Quality').should('exist');
      cy.get('h5').contains('Missing Annotation').should('exist');
    });
  });
});
