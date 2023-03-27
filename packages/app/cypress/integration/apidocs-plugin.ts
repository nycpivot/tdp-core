import { Authentication } from '../support/authentication';

describe('API Docs Plugin', () => {
  beforeEach(() => {
    Authentication.guestLogin();
  });

  it('should render a link to the APIs in the sidebar', () => {
    cy.visit('/');
    cy.get('[aria-label="APIs"]').should('be.visible');
  });

  it('should render the index page for APIs', () => {
    cy.visit('/api-docs');
    cy.contains('APIs');
    cy.contains('example-grpc-api');
  });

  it('should render a show page for APIs', () => {
    cy.visit('/catalog/default/api/example-grpc-api');
    cy.contains('example-grpc-api');
  });

  it('should render provided and consumed APIs on the catalog entry page', () => {
    cy.visit('/catalog/default/component/example-service');
    cy.get('button[role="tab"]').contains('API').click();
    cy.contains('example-grpc-api');
    cy.contains('example-openapi-api');
  });

  it('should render any external hyperlinks for the API', () => {
    cy.visit('/catalog/default/api/example-grpc-api');
    cy.contains('http://www.example.com');
  });

  it('should not render the register existing api button', () => {
    cy.get('[aria-label="APIs"]').click();
    cy.get('[role="button"]')
      .contains(/register existing api/i)
      .should('not.exist');
  });
});
