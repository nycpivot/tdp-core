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
      cy.contains('gitlab-integration-component');
    });

    it('should render the github catalog', () => {
      cy.contains('github-integration-component');
    });

    it('should render the github enterprise catalog', () => {
      cy.contains('github-enterprise-integration-component');
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

    it('should render the component from the processor', () => {
      cy.contains('gitlab-processor-component');
    });
  });

  describe('Hello World Plugin', () => {
    it('should render the plugin content', () => {
      cy.visit('/hello-world');
      cy.contains('Hello World!!');
    });
  });

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
});
