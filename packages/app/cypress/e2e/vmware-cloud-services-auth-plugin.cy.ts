describe('VMware Cloud Services Sign-in', () => {
  it('displays a sign in card on the login page', () => {
    cy.visit('/');
    cy.contains(/Sign in with your VMware account/);
    cy.contains('li', /VMware Cloud Services/)
      .contains('button', /sign in/i)
      .should('be.visible');
  });

  it('opens a popup to the auth backend', () => {
    cy.visit('/');
    cy.window().then(win => {
      cy.stub(win, 'open').as('popup');
    });
    cy.contains('li', 'VMware Cloud Services').find('button').click();
    cy.get('@popup').should(
      'have.been.calledWithMatch',
      '/api/auth/vmwareCloudServices/start',
    );
  });
});
