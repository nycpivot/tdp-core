describe('App', () => {
  it('should render the catalog', () => {
    cy.visit('/');
    cy.contains('VMware Catalog');
    cy.contains('example-website');
  });
  it('should have the hello-world plugin', () => {
    cy.visit('/hello-world');
    cy.contains('Hello World!!');
  });
});
