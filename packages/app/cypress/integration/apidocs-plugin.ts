describe('API Docs Plugin', () => {
  it('should render a link to the APIs in the sidebar', () => {
    cy.visit('/');
    cy.contains('div[data-testid="sidebar-root"]', 'API');
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
});
