import { Authentication } from '../support/authentication';

describe('LDAP Plugin', () => {
  beforeEach(() => {
    Authentication.guestLogin();
  });

  it('should display users', () => {
    cy.get('[aria-haspopup=listbox]').click();
    cy.get('[role=listbox]').contains(/user/i).click();
    cy.contains(/alice/i).should('be.visible');
    cy.contains(/bob/i).should('be.visible');
    cy.contains(/carol/i).should('be.visible');

    cy.contains(/alice/i).click();
    cy.contains(/alice aston/i).should('be.visible');
    cy.contains(/alice@vmware.com/i).should('be.visible');
    cy.contains(/description added by custom user transformer/i).should(
      'be.visible',
    );

    cy.contains(/tanzu-portal-builder/i).click();

    cy.contains(/members/i).should('be.visible');
    cy.contains(/alice aston/i).should('be.visible');
    cy.contains(/bob barlow/i).should('be.visible');
  });

  it('should display groups', () => {
    cy.get('[aria-haspopup=listbox]').click();
    cy.get('[role=listbox]').contains(/group/i).click();
    cy.contains(/tap-gui/i).should('be.visible');
    cy.contains(/tanzu-portal-builder/i).should('be.visible');

    cy.contains(/tanzu-portal-builder/i).click();
    cy.contains(/description added by custom group transformer/i).should(
      'be.visible',
    );
  });
});
