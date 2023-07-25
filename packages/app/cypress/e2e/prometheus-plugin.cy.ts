import { Authentication } from '../support/authentication';

describe('Prometheus Plugin v2.4.9 in TPB v1.6.1', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
    cy.visit('/catalog');
    cy.intercept('GET', 'api/proxy/prometheus/api/query_range*', {
      fixture: '../fixtures/prometheus/range.json',
    }).as('getRange');
    cy.visit('/catalog');
    cy.intercept('GET', 'api/proxy/prometheus/api/rules*', {
      fixture: '../fixtures/prometheus/alerts.json',
    }).as('getAlerts');
    cy.contains('Catalog');
    cy.get('input[placeholder=Filter]').type('prometheus-entity');
    cy.contains('prometheus-entity');
    cy.get('td[value="prometheus-entity"]')
      .should('be.visible')
      .children('a')
      .click();
  });
  it('should display the overview cards', () => {
    cy.wait('@getAlerts');
    cy.wait('@getRange');
    cy.contains('Prometheus Alerts').should('be.visible');
    cy.contains('HighRequestLatency').should('be.visible');
    cy.contains('alertname: HighRequestLatency').should('be.visible');
    cy.contains('node_memory_active_bytes').should('be.visible');
    cy.get('#prometheus-graph-overview .recharts-legend-item').should(
      'contain.text',
      'node_memory_active_bytes',
    );
  });
  it('Should display the prometheus tab on the Entity details', () => {
    cy.get('button').contains('Prometheus').click();
    cy.wait('@getAlerts');
    cy.wait('@getRange');
    cy.contains('Prometheus Alerts').should('be.visible');
    cy.contains('HighRequestLatency').should('be.visible');
    cy.contains('alertname: HighRequestLatency').should('be.visible');
    cy.contains('node_memory_active_bytes').should('be.visible');
    cy.get('.recharts-legend-item').should(
      'contain.text',
      'node_memory_active_bytes',
    );
  });
});
