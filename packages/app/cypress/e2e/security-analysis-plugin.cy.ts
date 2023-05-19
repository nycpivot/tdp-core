import { Authentication } from '../support/authentication';

describe('Security Analysis', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
  });

  it('should display link in the sidebar that loads the security analysis plugin', () => {
    cy.visit('/');
    cy.get('a[aria-label="Security Analysis"]').click();
    cy.contains('An analysis of vulnerabilities discovered in workload builds');
  });
});
