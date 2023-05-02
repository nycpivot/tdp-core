import { Authentication } from '../support/authentication';

describe('API Scoring Plugin', () => {
  beforeEach(() => {
    createApiDoc();
    Authentication.guestLogin();
  });

  it('should render', () => {
    cy.visit('/api-docs');
    cy.contains(/cats/i).click({ force: true }); // force=true fixes a flakeyness issue since the link is render asynchronously
    cy.contains(/validation analysis/i);
    cy.contains(/34.4%/);
    cy.contains(/70%/);
    cy.contains(/89.1%/);
  });

  function createApiDoc() {
    cy.fixture('api-scoring/api.yaml').then(content =>
      cy.request({
        method: 'PUT',
        url: `${Cypress.env(
          'ESBACK_BACKEND_URL',
        )}/api/catalog/immediate/entities`,
        headers: {
          'User-Agent': 'test-agent',
          'Content-Type': 'application/yaml',
        },
        body: content,
      }),
    );
  }
});
