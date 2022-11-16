import axios from 'axios'

describe("Bitbucket Server", () => {
  it('should render the bitbucket server catalog', async () => {
    await axios.post(`${Cypress.config().baseUrl}/api/catalog/locations`, {
      type: 'url',
      target: `http://${Cypress.env('BITBUCKET_HOST')}/projects/ESBACK/repos/catalog/raw/bitbucket-server-integration-component.yaml`
    })

    cy.visit('/');
    cy.contains('bitbucket-server-component');
  });
})