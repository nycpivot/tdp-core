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

  it('should render the date', () => {
    cy.visit('/hello-world');
    cy.contains(/\d{4}-\d{2}-\d{2}/i);
    cy.contains(/\d{2}:\d{2}:\d{2}/i);
  });
});
