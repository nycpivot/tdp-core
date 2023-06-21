import { Authentication } from '../support/authentication';

describe('App Live View Plugin', () => {
  beforeEach(() => {
    cy.visit('/');
    Authentication.googleSvcTpbLogin();
  });

  it('should render Live View section on a Component Runtime Resources Tab', () => {
    cy.get('[placeholder=Filter]').type('tanzu-java-web-app');
    cy.contains(/tanzu-java-web-app/i).click();
    cy.contains(/runtime resources/i).click();
    cy.contains('tr', /pod/i)
      .children()
      .contains(/tanzu-java-web-app/i)
      .click();
    cy.contains(/live view/i);
  });

  it('should not render a link to ALV in the sidebar', () => {
    cy.get('[aria-label="App Live View"]').should('not.exist');
  });
});
