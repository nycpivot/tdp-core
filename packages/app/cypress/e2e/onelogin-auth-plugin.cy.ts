describe('OneLogin', () => {
  it('should display the sign in button', () => {
    cy.visit('/');
    cy.contains(/sign in with onelogin/i);
    cy.contains('li', /onelogin/i)
      .contains('button', /sign in/i)
      .should('be.visible');
  });
});
