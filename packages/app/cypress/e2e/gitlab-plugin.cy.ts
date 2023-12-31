import { Authentication } from '../support/authentication';

describe('Gitlab plugin', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
    cy.get('input[placeholder="Filter"]').type('simple');
    cy.contains(/simple-app/i).click();
  });

  it('should display overview', () => {
    cy.contains(/contributors/i, { timeout: 10000 }).scrollIntoView();
    cy.contains(/contributors/i, { timeout: 10000 }).should('be.visible');
    cy.contains(/languages/i).scrollIntoView();
    cy.contains(/languages/i).should('be.visible');
    cy.contains(/merge requests statistics/i).scrollIntoView();
    cy.contains(/merge requests statistics/i).should('be.visible');
    cy.contains(/gitlab pipelines/i).scrollIntoView();
    cy.contains(/gitlab pipelines/i).should('be.visible');
    cy.contains(/gitlab merge request/i).scrollIntoView();
    cy.contains(/gitlab merge request/i).should('be.visible');
  });

  it('should display info in the Gitlab tab', () => {
    cy.contains('button', 'Gitlab').click();
    cy.contains(/contributors/i, { timeout: 10000 }).scrollIntoView();
    cy.contains(/contributors/i, { timeout: 10000 }).should('be.visible');
    cy.contains(/languages/i).scrollIntoView();
    cy.contains(/languages/i).should('be.visible');
    cy.contains(/merge requests statistics/i).scrollIntoView();
    cy.contains(/merge requests statistics/i).should('be.visible');
    cy.contains(/gitlab pipelines/i).scrollIntoView();
    cy.contains(/gitlab pipelines/i).should('be.visible');
    cy.contains(/gitlab merge request/i).scrollIntoView();
    cy.contains(/gitlab merge request/i).should('be.visible');
    cy.contains(/gitlab issues/i).scrollIntoView();
    cy.contains(/gitlab issues/i).should('be.visible');
  });
});
