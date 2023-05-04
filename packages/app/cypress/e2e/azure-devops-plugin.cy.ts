import { Authentication } from '../support/authentication';

describe('Azure DevOps Backend Plugin', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
  });

  it('should render the component from the processor', () => {
    cy.contains('azure-processor-component');
  });
});
