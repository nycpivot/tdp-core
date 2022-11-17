describe("Bitbucket Server", () => {
  beforeEach(async () => {
    cy.log('Creating bitbucket token')
    cy.log('bitbucket url: ' + `http://${Cypress.env('BITBUCKET_HOST')}/rest/access-tokens/latest/users/esback`)

    const token = await new Cypress.Promise((resolve) => cy.request({
      method: 'PUT',
      url: `http://${Cypress.env('BITBUCKET_HOST')}/rest/access-tokens/latest/users/esback`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic ZXNiYWNrOmVzYmFjaw=='
      },
      body: {
        expiryDays: 2154,
        name: "super token",
        permissions: [
          "REPO_ADMIN",
          "PROJECT_ADMIN"
        ]
      }
    }).then((response) => resolve(response.body.token)))
    cy.log("token: " + token)
  })

  it('should render the bitbucket server catalog', async () => {
    // await axios.post(`${Cypress.config().baseUrl}/api/catalog/locations`, {
    //   type: 'url',
    //   target: `http://${Cypress.env('BITBUCKET_HOST')}/projects/ESBACK/repos/catalog/raw/bitbucket-server-integration-component.yaml`
    // })

    cy.visit('/');
    // cy.contains('bitbucket-server-component');
  });
})