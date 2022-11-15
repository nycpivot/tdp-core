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
      cy.contains('pstar635');
    });

    it('should render the bitbucket server catalog', () => {
      cy.contains('bitbucket-server-component');
    });

    describe('Custom entity provider plugin', () => {
      it('should render custom provider entity', () => {
        cy.contains('Custom Entity Provider Entity');
      });
    });

    describe('Custom processor plugin', () => {
      it('should render custom processor entity', () => {
        cy.contains('Custom Processor Entity');
      });
    });
  });

  describe('Gitlab Backend Plugin', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should render the component from the provider', () => {
      cy.contains('gitlab-provider-component');
    });
  });

  describe('Hello World Plugin', () => {
    it('should render the plugin content', () => {
      cy.visit('/hello-world');
      cy.contains('Hello World!!');
    });
  });
});
