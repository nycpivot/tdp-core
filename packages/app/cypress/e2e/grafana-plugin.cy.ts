import { Authentication } from '../support/authentication';

describe('Grafana v0.1.22 in TPB v1.6.0', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
    cy.visit('/catalog');
    cy.intercept(
      'GET',
      'api/proxy/grafana/api/api/search?type=dash-db&tag=grafanacloud',
      {
        fixture: '../fixtures/grafana/dashboard.json',
      },
    ).as('getDashboards');

    cy.intercept(
      'GET',
      'api/proxy/grafana/api/api/ruler/grafana/api/v1/rules',
      {
        fixture: '../fixtures/grafana/alerts.json',
      },
    ).as('getAlerts');
  });

  it('should render grafana-example', () => {
    cy.get('input[placeholder=Filter]').type('grafana-example');
    cy.contains('grafana-example');
  });

  describe('the user navigates to grafana-example component', () => {
    beforeEach(() => {
      cy.get('input[placeholder=Filter]').type('grafana-example');
      cy.get('a').contains('grafana-example').click({ force: true });
    });

    it('on overview tab', () => {
      cy.get('p').contains('component — website').should('exist');
      cy.get('h1').contains('grafana-example').should('exist');
      cy.get('div').contains('About').should('exist');
    });

    it('can see Grafana Alert card', () => {
      cy.get('h2').contains('Alerts').should('exist');
      cy.get('a').contains('Http monitoring').should('exist');
      cy.get('a')
        .contains('Http monitoring')
        .should(
          'have.attr',
          'href',
          'https://test.grafana.net//alerting/grafana/d1441749-6ac6-42ac-80ef-5ad9d7604151/view',
        );
    });

    it('can see Grafana Dashboard card', () => {
      cy.get('h2').contains('Dashboards').should('exist');
      cy.get('a').contains('Billing/Usage').should('exist');
      cy.get('a')
        .contains('Billing/Usage')
        .should(
          'have.attr',
          'href',
          'https://test.grafana.net//d/c1d175f9-f7b8-4d46-9b4a-9599c409c2b5/billing-usage',
        );
    });
  });

  describe('the user navigates to example-website component', () => {
    beforeEach(() => {
      cy.get('a').contains('example-website').click({ force: true });
    });

    it('on overview tab', () => {
      cy.get('p').contains('component — website').should('exist');
      cy.get('h1').contains('example-website').should('exist');
      cy.get('div').contains('About').should('exist');
    });

    it('can see Grafana Alert card with Missing Annotation message', () => {
      cy.get('p')
        .contains('The annotation grafana/alert-label-selector is missing')
        .should('exist');
    });

    it('can see Grafana Dashboard card with Missing Annotation message', () => {
      cy.get('p')
        .contains('The annotation grafana/dashboard-selector is missing')
        .should('exist');
    });
  });
});
