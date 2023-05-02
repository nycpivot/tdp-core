import { Authentication } from '../support/authentication';

describe("Esback's Github Plugin", () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
  });

  it('should render components from org repositories', () => {
    cy.get('[placeholder=Filter]').type('github');
    cy.contains('github-component-1');
    cy.contains('github-component-2');
  });

  it('should load users and groups from org', () => {
    cy.contains('cmbu-vra').click();

    cy.contains('Ownership');
  });
});
