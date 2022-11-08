describe("Bitbucket Server", () => {
  it('should render the bitbucket server catalog', () => {
    cy.visit('/');
    cy.contains('bitbucket-server-component');
  });
})