describe('App', () => {
  describe("Catalog Plugin", () => {
    it('should render the catalog', () => {
      cy.visit('/');
      cy.contains('VMware Catalog');
      cy.contains('example-website');
      cy.contains('tap-gui-component');
    });
  })

  describe("Hello World Plugin", () => {
    it('should have the hello-world plugin', () => {
      cy.visit('/hello-world');
      cy.contains('Hello World!!');
    });
  })
});
