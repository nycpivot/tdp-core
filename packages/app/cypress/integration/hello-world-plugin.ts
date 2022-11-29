describe('Hello World Plugin', () => {
  it('should render the plugin content', () => {
    cy.visit('/hello-world');
    cy.contains('Hello World!!');
  });
});
