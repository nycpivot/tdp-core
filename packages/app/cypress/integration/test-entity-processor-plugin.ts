describe('Custom processor plugin', () => {
  it('should render custom processor entity', () => {
    cy.visit('/');
    cy.contains('Custom Processor Entity');
  });
});
