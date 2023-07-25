describe('GitLab Auth Plugins', () => {
  it('allows the user to authenticate with GitLab', () => {
    cy.visit('/');
    cy.window().then(win => {
      cy.stub(win, 'open', url => {
        win.location.href = 'https://gitlab.com/users/sign_in';
      }).as('popup');
    });
    cy.contains('li', 'GitLab').find('button').click();
    cy.get('@popup').should('be.called');
    cy.contains(
      /gitlab\.com needs to review the security of your connection before proceeding/i,
    );
  });
});
