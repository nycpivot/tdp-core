import { Authentication } from '../support/authentication';

describe('Snyk v2.0.0 in TPB v1.6.0', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
    cy.visit('/catalog');
  });
  it('displays the Snyk Overview card on the Entity overview', () => {
    cy.contains('Catalog');

    cy.get('input[placeholder=Filter]').type('snyk-test-service');

    cy.contains('snyk-test-service');

    cy.get('td[value="snyk-test-service"]')
      .should('be.visible')
      .children('a')
      .click();

    cy.intercept(
      'GET',
      'api/proxy/snyk/rest/orgs/883c2d65-1170-40d8-bf5c-bbba4a13eec1/targets*',
      {
        fixture: '../fixtures/snyk/targets.json',
      },
    ).as('getTargets');

    cy.intercept(
      'GET',
      'api/proxy/snyk/rest/orgs/883c2d65-1170-40d8-bf5c-bbba4a13eec1/projects*',
      {
        fixture: '../fixtures/snyk/projects.json',
      },
    ).as('getProjects');

    cy.intercept(
      'GET',
      'api/proxy/snyk/rest/orgs/883c2d65-1170-40d8-bf5c-bbba4a13eec1/issues*',
      {
        fixture: '../fixtures/snyk/issues.json',
      },
    ).as('getIssues');

    cy.wait('@getTargets');
    cy.wait('@getProjects');
    cy.wait('@getIssues');

    cy.contains('Vulnerabilities').should('be.visible');
    cy.get('[data-test-id="CircularProgressbarWithChildren"]').should(
      'be.visible',
    );
  });

  it('displays Scan data on the Security tab', () => {
    cy.contains('Catalog');

    cy.get('input[placeholder=Filter]').type('snyk-test-service');

    cy.contains('snyk-test-service');

    cy.get('td[value="snyk-test-service"]')
      .should('be.visible')
      .children('a')
      .click();
    cy.get('button').contains('Security').click();

    cy.intercept(
      'GET',
      'api/proxy/snyk/rest/orgs/883c2d65-1170-40d8-bf5c-bbba4a13eec1/targets*',
      {
        fixture: '../fixtures/snyk/targets.json',
      },
    ).as('getTargets');

    cy.intercept(
      'GET',
      'api/proxy/snyk/rest/orgs/883c2d65-1170-40d8-bf5c-bbba4a13eec1/projects*',
      {
        fixture: '../fixtures/snyk/projects.json',
      },
    ).as('getProjects');

    cy.intercept(
      'GET',
      'api/proxy/snyk/rest/orgs/883c2d65-1170-40d8-bf5c-bbba4a13eec1/issues*',
      {
        fixture: '../fixtures/snyk/issues.json',
      },
    ).as('getIssues');

    cy.intercept(
      'GET',
      'api/proxy/snyk/v1/org/883c2d65-1170-40d8-bf5c-bbba4a13eec1/project/34258b5b-8f96-4437-9a7b-bdd20efee447/dep-graph',
      {
        fixture: '../fixtures/snyk/dep-graph.json',
      },
    ).as('getDepGraph');

    cy.intercept(
      'GET',
      'api/proxy/snyk/v1/org/883c2d65-1170-40d8-bf5c-bbba4a13eec1/project/34258b5b-8f96-4437-9a7b-bdd20efee447',
      {
        fixture: '../fixtures/snyk/project-details.json',
      },
    ).as('getProjectDetails');

    cy.wait('@getTargets');
    cy.wait('@getProjects');
    cy.wait('@getIssues');
    cy.wait('@getDepGraph');
    cy.wait('@getProjectDetails');

    // Details card
    cy.contains('snyk-repo').should('be.visible');
    cy.contains('http://github.com/vmware/snyk-repo.git').should('be.visible');

    // Charts
    cy.contains('Vulnerabilities').should('be.visible');
    cy.contains('License Issues').should('be.visible');
    cy.contains('Ignored Issues').should('be.visible');

    // Issues tab
    cy.contains('Security vulnerabilities').should('be.visible');
    cy.contains('package_vulnerability').should('be.visible');
    cy.contains('Regular Expression Denial of Service (ReDoS)').should(
      'be.visible',
    );

    // License issues tab
    cy.get('button').contains('License Issues').click();
    cy.contains('Security vulnerabilities').should('be.visible');
    cy.contains('No records to display').should('be.visible');

    // Ignored tab
    cy.get('button').contains('Ignored').click();
    cy.contains('Security vulnerabilities').should('be.visible');
    cy.contains('No records to display').should('be.visible');

    // More details link

    cy.contains('More details').should('be.visible');
  });
});
