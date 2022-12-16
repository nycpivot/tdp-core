import { Authentication } from '../support/authentication';

describe('Gitlab Backend Plugin', () => {
  beforeEach(() => {
    Authentication.guestLogin();
  });

  it('should render the component from the provider', () => {
    cy.contains('gitlab-provider-component');
  });

  it('should render the component from the processor', () => {
    cy.contains('gitlab-processor-component');
  });
});
