import { Authentication } from '../support/authentication';

describe('Hello World Plugin', () => {
  beforeEach(() => {
    Authentication.guestLogin();
  });

  it('should render the plugin content', () => {
    cy.visit('/hello-world');
    cy.contains('Hello World!!');
  });
});
