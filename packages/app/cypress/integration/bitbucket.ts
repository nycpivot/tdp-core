import {faker} from '@faker-js/faker'

describe("Bitbucket Server", () => {
  beforeEach(async () => {
    cy.log('Creating bitbucket token')
    cy.log('bitbucket url: ' + `http://${Cypress.env('BITBUCKET_HOST')}/rest/api/latest/projects`)

    const project = {
      key: faker.random.alpha({count: 5, casing: 'upper'}),
      name: faker.random.alphaNumeric(10)
    }

    await new Cypress.Promise((resolve, reject) => cy.request(
      {
        method: 'POST',
        url: `http://${Cypress.env('BITBUCKET_HOST')}/rest/api/latest/projects`,
        headers: {
          'Authorization': 'Basic ZXNiYWNrOmVzYmFjaw==',
          'User-Agent': 'test-agent',
        },
        body: project
      }
    ).then(() => resolve()))

    cy.log("Project " + project.name + " created (key: " + project.key + ")")

    const repo = {
      slug: faker.random.alpha({count: 5, casing: 'upper'}),
      name: faker.random.alphaNumeric(10),
      scmId: "git"
    }

    cy.request(
      {
        method: 'POST',
        url: `http://${Cypress.env('BITBUCKET_HOST')}/rest/api/latest/projects/${project.key}/repos`,
        headers: {
          Authorization: 'Basic ZXNiYWNrOmVzYmFjaw==',
          'User-Agent': 'test-agent',
        },
        body: repo
      }
    )

    cy.log("repository " + repo.name + " created (slug: " + repo.slug + ")")



    const token = await new Cypress.Promise((resolve) => cy.request({
      method: 'PUT',
      url: `http://${Cypress.env('BITBUCKET_HOST')}/rest/access-tokens/1.0/users/esback`,
      headers: {
        Authorization: 'Basic ZXNiYWNrOmVzYmFjaw=='
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
