import { Authentication } from '../support/authentication';

describe('RRV Plugin', () => {
  beforeEach(() => {
    cy.visit('/');
    Authentication.googleSvcTpbLogin();
  });

  it('should render the runtime resources and the pod logs', () => {
    cy.get('[placeholder=Filter]').type('tap-gui');
    cy.contains(/tap-gui-component/i).click();
    cy.contains(/runtime resources/i).click();
    cy.contains('tr', /pod/i)
      .children()
      .contains(/server/i)
      .click();
    cy.contains(/view pod logs/i).click();
    cy.contains(/view pod details/i).should('be.visible');
    cy.get('[role=row]')
      .filter(':visible')
      .should('have.length.greaterThan', 1)
      .contains('level')
      .should('be.visible');
  });

  // re add RRV/ALV component test after integration test TAP updated to >1.5

  describe('rbac', () => {
    it('should require login when not authenticated', () => {
      Authentication.googleLogout();
      Authentication.googleSvcTpbInsufficientScopeLogin();
      cy.get('input[placeholder=Filter]').type('gke-svc');
      cy.contains(/gke-svc-tpb-nginx/i).click();
      cy.contains(/runtime resources/i).click();
      cy.contains(/login required/i).should('be.visible');
      cy.contains(/svc-tpb-server/i).should('not.exist');
    });

    it('should show k8s resources for user svc-tpb', () => {
      cy.get('input[placeholder=Filter]').type('gke-svc');
      cy.contains(/gke-svc-tpb-nginx/i).click();
      cy.contains(/runtime resources/i).click();
      cy.contains(/login required/i).should('not.exist');
      cy.contains(/svc-tpb-server/i).should('be.visible');
    });

    it('should not show k8s resources for user svc-tpb-1', () => {
      cy.get('input[placeholder=Filter]').type('gke-svc');
      cy.contains(/gke-svc-tpb-1-nginx/i).click();
      cy.contains(/runtime resources/i).click();
      cy.contains(/svc-tpb-1-server/i).should('not.exist');
    });
  });
});
