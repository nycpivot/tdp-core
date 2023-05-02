import { Authentication } from '../support/authentication';

describe('Hello World Plugin', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
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
  it('should display a banner', () => {
    cy.visit('/');
    cy.contains('Hello World Banner');
  });

  it('should customize api page overview', () => {
    cy.visit('/api-docs');
    cy.contains(/example-grpc-api/i).click();
    cy.contains(/i am an hello world overview/i);
  });
});
