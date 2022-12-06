describe('Techdocs Plugin', () => {
  it('should render a link to the docs in the sidebar', () => {
    cy.visit('/');
    cy.contains('div[data-testid="sidebar-root"]', 'Docs');
  });

  it('should render the index page for techdocs', () => {
    cy.visit('/docs');
    cy.contains('Documentation');
    cy.contains('example-website');
  });

  it('should render a show page for techdocs', () => {
    cy.visit('/docs/default/component/example-website');
    cy.contains('Example Techdocs');
  });

  it('should enable a link on the catalog entity page to the docs page', () => {
    cy.visit('/catalog/default/component/example-website');
    cy.contains('View TechDocs').should(
      'have.attr',
      'href',
      '/docs/default/Component/example-website',
    );
  });
});
