import { Authentication } from '../support/authentication';

describe('Microsoft Graph Org Reader Processor Plugin', () => {
  beforeEach(() => {
    Authentication.guestLogin();
  });

  it('should display imported users with any transformations', () => {
    cy.get('[aria-haspopup=listbox]').click();
    cy.get('[role=listbox]').contains(/User/i).click();
    cy.contains(/besmith_vmware.com-test-user-transformer/i).should(
      'be.visible',
    );
  });

  it('should display imported groups with any transformations', () => {
    cy.get('[aria-haspopup=listbox]').click();
    cy.get('[role=listbox]').contains(/Group/i).click();
    cy.contains(/dap-build-test-group-transformer/i).should('be.visible');
  });

  it('should display imported organizations with any transformations', () => {
    cy.get('[aria-haspopup=listbox]').click();
    cy.get('[role=listbox]').contains(/Group/i).click();
    cy.contains(/vmware_inc.-test-organization-transformer/i).should(
      'be.visible',
    );
  });
});
