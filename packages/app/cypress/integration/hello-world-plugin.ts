import { Authentication } from '../support/authentication';

describe('Hello World Plugin', () => {
  beforeEach(() => {
    Authentication.guestLogin();
  });

  it('should render the plugin content', () => {
    cy.visit('/hello-world');
    cy.contains('Hello World!!');
  });

  it('should display a tab on the settings page', () => {
    cy.visit('/settings');
    cy.contains('Hello World Tab');
    cy.visit('/settings/hello-world');
    cy.contains('Hello World Settings Tab Content');
  });
});
