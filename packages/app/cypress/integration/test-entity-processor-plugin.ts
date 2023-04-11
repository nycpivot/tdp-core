import { Authentication } from '../support/authentication';

describe('Custom processor plugin', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
  });

  it('should render custom processor entity', () => {
    cy.visit('/');
    cy.contains('Custom Processor Entity');
  });
});
