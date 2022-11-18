import {faker} from '@faker-js/faker'

describe("Bitbucket Server", () => {
  it('should render the bitbucket server catalog', () => {
    const project = {
      key: faker.random.alpha({count: 5, casing: 'upper'}),
      name: faker.random.alphaNumeric(10)
    }

    const repo = {
      slug: faker.random.alpha({count: 5, casing: 'upper'}),
      name: faker.random.alphaNumeric(10),
      scmId: "git"
    }

    const catalogName = faker.random.alpha(10) + ".yml"
    const componentName = faker.random.alpha(10)

    let content = `
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: bitbucket-server-integration-component
  description: Bitbucket Server Component
  tags:
    - v1
spec:
  type: service
  lifecycle: production
  owner: default-team
  system: esback
    `
    content = content.replace("bitbucket-server-integration-component", componentName)

    const data = new FormData()
    data.append("branch", "master")
    data.append("message", "my catalog")

    data.append("content", content)

    cy.log("Creating project...")

    cy.request(
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
        body: project,
        failOnStatusCode: false
      }
    )
      .then(() => {
        cy.log("Project created")
      })

    cy.request(
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
    )
      .then(() => {
        cy.log("Repository created")
      })

    cy.request(
      {
        method: 'PUT',
        url: `http://${Cypress.env('BITBUCKET_HOST')}/rest/api/latest/projects/${project.key}/repos/${repo.name}/browse/${catalogName}`,
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
    )
      .then(() => {
        cy.log("Catalog file pushed")
      })

    cy.log("Project " + project.name + " created (key: " + project.key + ")")
    cy.log("repository " + repo.name + " created (slug: " + repo.slug + ")")
    cy.log("Pushing catalog file...")

    cy.request({
      method: 'POST',
      url: `/api/catalog/locations`,
      headers: {
        'User-Agent': 'test-agent',
        'Content-Type': 'application/json'
      },
      body: {
        type: 'url',
        target: `http://bitbucket:7990/projects/${project.key}/repos/${repo.name}/raw/${catalogName}`
      }
    })

    cy.visit('/')
    cy.log('looking for component ' + componentName)
    cy.waitUntil(() => {
      if (Cypress.$("td:contains(" + componentName + ")").length === 1) {
        cy.log("Component already there")
        return true
      }
      return cy
        .reload()
        .wait(2000)
        .then(() => Cypress.$("td:contains(" + componentName + ")"))
        .then((result) => result.length === 1);
    }, {
      interval: 2000,
      timeout: 30000,
      verbose: true
    });
  });
})
