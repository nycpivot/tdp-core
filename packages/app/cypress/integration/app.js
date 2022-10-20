describe('App', () => {
  describe('Catalog Plugin', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should render the title', () => {
      cy.contains('VMware Catalog');
    });

    it('should render the local catalog', () => {
      cy.contains('example-website');
    });

    it('should render the gitlab catalog', () => {
      cy.contains('tap-gui-component');
    });

    it('should render the github catalog', () => {
      cy.contains('github-component');
    });

    it('should render the github enterprise catalog', () => {
      cy.contains('pstar365');
    });
  });

  describe('Hello World Plugin', () => {
    it('should render the plugin content', () => {
      cy.visit('/hello-world');
      cy.contains('Hello World!!');
    });
  });
});
