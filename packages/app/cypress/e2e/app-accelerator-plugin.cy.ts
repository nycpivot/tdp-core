import {Authentication} from "../support/authentication"

describe('App Accelerator Plugin', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
    cy.visit('/create');
  });

  it('should show app accelerators', () => {
    cy.contains(/angular frontend/i).should('be.visible');
  });

  it('should generate app accelerators', () => {
    cy.get('[aria-label="Choose Angular Frontend"').click();
    cy.contains('button', /next/i).click();
    cy.contains('button', /next/i).click();
    cy.contains('button', /generate accelerator/i).click();
    cy.contains('button', /download zip file/i).should('be.visible');
  });
})
