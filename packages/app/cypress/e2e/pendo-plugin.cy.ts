import { Authentication } from '../support/authentication';

describe('Pendo', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
  });

  it('displays the telemetry banner', () => {
    cy.visit('/');
    cy.contains('Please accept telemetry collection for optimal performance.');
  });

  it('should display a tab on the settings page', () => {
    cy.visit('/settings');
    cy.contains('Preferences');
    cy.visit('/settings/preferences');
    cy.contains('You are currently not enrolled in TAP Telemetry');
  });
});
