describe('App', () => {
  describe("Catalog Plugin", () => {
    beforeEach(() => {
      cy.visit('/');
    })

    it('should render the title', () => {
      cy.contains('VMware Catalog');
    });

    it('should render the local catalog', () => {
      cy.contains('example-website');
    })

    it('should render the gitlab catalog', () => {
      cy.contains('tap-gui-component');
    })
  })

  describe("Hello World Plugin", () => {
    it('should have the hello-world plugin', () => {
      cy.visit('/hello-world');
      cy.contains('Hello World!!');
    });
  })
});
