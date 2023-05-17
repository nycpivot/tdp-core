describe('VMware Cloud Services Sign-in', () => {
  it('displays a sign in card on the login page', () => {
    cy.visit('/');
    cy.contains(/Sign in with your VMware account/);
    cy.contains('li', /VMware Cloud Services/)
      .contains('button', /sign in/i)
      .should('be.visible');
  });
});
