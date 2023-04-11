import { Authentication } from '../support/authentication';

describe('Custom entity provider plugin', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
  });

  it('should render custom provider entity', () => {
    cy.visit('/');
    cy.contains('Custom Entity Provider Entity');
  });
});
