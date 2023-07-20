import { Authentication } from '../support/authentication';

describe('Jira plugin v2.4.8 in TDP v1.6.0', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
    cy.visit('/catalog');
    cy.intercept('GET', 'api/proxy/jira/api/rest/api/latest/project/ESBACK', {
      fixture: '../fixtures/jira/project.json',
    }).as('getProject');

    cy.intercept('POST', 'api/proxy/jira/api/rest/api/latest/search', {
      fixture: '../fixtures/jira/search.json',
    }).as('getSearch');

    cy.intercept(
      'GET',
      'api/proxy/jira/api/rest/api/latest/project/ESBACK/statuses',
      {
        fixture: '../fixtures/jira/status.json',
      },
    ).as('getStatuses');

    cy.intercept(
      'GET',
      'api/proxy/jira/api/activity?maxResults=25&streams=key+IS+ESBACK&os_authType=basic',
      {
        fixture: '../fixtures/jira/activity.html',
      },
    ).as('getActivityStream');
  });

  it('should render jira-example', () => {
    cy.get('input[placeholder=Filter]').type('jira-example');
    cy.contains('jira-example');
  });

  describe('the user navigates to jira-example component', () => {
    beforeEach(() => {
      cy.get('input[placeholder=Filter]').type('jira-example');
      cy.get('a').contains('jira-example').click({ force: true });
    });

    it('on overview tab', () => {
      cy.get('p').contains('component — website').should('exist');
      cy.get('h1').contains('jira-example').should('exist');
      cy.get('div').contains('About').should('exist');
    });

    it('can see Jira Overview card with details', () => {
      cy.get('div').contains('Jira').should('exist');
      cy.get('div').contains('Tanzu Portal Builder').should('exist');
      cy.get('h6').contains('Task').should('exist');
      cy.get('h6').contains('Story').should('exist');
      cy.get('h6').contains('Bug').should('exist');
      cy.get('h6').contains('Epic').should('exist');
      cy.get('h6').contains('Initiative').should('exist');
      cy.get('h6').contains('Activity stream').should('exist');
      cy.get('p')
        .contains('Go to project')
        .parent()
        .parent()
        .parent()
        .parent()
        .should(
          'have.attr',
          'href',
          'https://jira.eng.vmware.com/browse/ESBACK',
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

    it('can see Jira Overview card is missing', () => {
      cy.get('div').contains('Jira').should('not.exist');
    });
  });
});
