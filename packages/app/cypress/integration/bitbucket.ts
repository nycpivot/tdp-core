import {faker} from '@faker-js/faker'

describe("Bitbucket Server", () => {
  beforeEach(async () => {
    const project = {
      key: faker.random.alpha({count: 5, casing: 'upper'}),
      name: faker.random.alphaNumeric(10)
    }

    cy.log("Creating project...")
    await new Cypress.Promise((resolve, reject) => cy.request(
      {
        method: 'POST',
        url: `http://${Cypress.env('BITBUCKET_HOST')}/rest/api/latest/projects`,
        auth: {
          user: 'esback',
          pass: 'esback'
        },
        headers: {
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

    cy.log("Creating repository...")
    await new Cypress.Promise((resolve, reject) => cy.request(
      {
        method: 'POST',
        url: `http://${Cypress.env('BITBUCKET_HOST')}/rest/api/latest/projects/${project.key}/repos`,
        auth: {
          user: 'esback',
          pass: 'esback'
        },
        headers: {
          'User-Agent': 'test-agent',
        },
        body: repo
      }
    ).then(() => resolve()))

    cy.log("repository " + repo.name + " created (slug: " + repo.slug + ")")

    cy.log("Pushing catalog file...")
    const data = new FormData()
    data.append("branch", "master")
    data.append("message", "my catalog")
    data.append("content", "hello world")
    await new Cypress.Promise((resolve, reject) => cy.request(
      {
        method: 'PUT',
        url: `http://${Cypress.env('BITBUCKET_HOST')}/rest/api/latest/projects/${project.key}/repos/${repo.name}/browse/hello.txt`,
        auth: {
          user: 'esback',
          pass: 'esback'
        },
        headers: {
          'User-Agent': 'test-agent',
          'Content-Type': 'multipart/form-data'
        },
        body: data
      }
    ).then(() => resolve()))

    cy.log('Catalog file pushed to repository')
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
