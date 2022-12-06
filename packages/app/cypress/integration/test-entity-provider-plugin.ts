describe('Custom entity provider plugin', () => {
  it('should render custom provider entity', () => {
    cy.visit('/');
    cy.contains('Custom Entity Provider Entity');
  });
});
