describe("Esback's Github Plugin", () => {
  it('should render components from org repositories', () => {
    cy.visit('/');
    cy.contains('github-component-1');
    cy.contains('github-component-2');
  });
});
