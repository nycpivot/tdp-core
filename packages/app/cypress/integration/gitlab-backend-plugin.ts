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
