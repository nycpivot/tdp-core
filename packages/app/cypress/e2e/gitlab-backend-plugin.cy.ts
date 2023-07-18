import { Authentication } from '../support/authentication';

describe('Gitlab Backend Plugin', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
  });

  it('should render the component from the provider', () => {
    cy.get('input[placeholder=Filter]').type('gitlab-provider-component');
    cy.contains('gitlab-provider-component');
  });

  it('should render the component from the processor', () => {
    cy.get('input[placeholder=Filter]').type('gitlab-processor-component');
    cy.contains('gitlab-processor-component');
  });
});
