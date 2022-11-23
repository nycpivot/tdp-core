import { faker } from '@faker-js/faker';

describe('Bitbucket Server', () => {
  let componentName: string;

  beforeEach(() => {
    const project = createProject();
    const repo = createRepository(project);
    const catalogName = `${faker.random.alpha(10)}.yml`;

    componentName = `bitbucket-server-${faker.random.alpha(5)}`;

    cy.fixture('bitbucket-server/component.yaml').then(content => {
      const newContent = content.replace(
        'bitbucket-server-integration-component',
        componentName,
      );
      commitContent(project, repo, catalogName, {
        name: catalogName,
        branch: 'master',
        message: 'my e2e catalog',
        content: newContent,
      });
      addCatalogLocation(
        project,
        repo,
        `http://bitbucket:7990/projects/${project.key}/repos/${repo.name}/raw/${catalogName}`,
      );
    });
  });

  it('should render the bitbucket server catalog', () => {
    cy.visit('/');
    reloadPageUntilElementVisible(() =>
      Cypress.$(`td:contains(${componentName})`),
    );
    cy.contains(componentName).should('be.visible');
  });
});

function reloadPageUntilElementVisible(query: () => JQuery<HTMLElement>) {
  cy.waitUntil(
    () => {
      if (query().length === 1) {
        cy.log('Component already there');
        return true;
      }
      return cy
        .reload()
        .wait(2000)
        .then(() => query())
        .then(result => result.length === 1);
    },
    {
      interval: 3000,
      timeout: 60000,
      verbose: true,
    },
  );
}

type Project = {
  name: string;
  key: string;
};

type Repository = {
  name: string;
  slug: string;
  scmId: string;
};

type FileToCommit = {
  name: string;
  message: string;
  branch: string;
  content: string;
};

function commitContent(
  project: Project,
  repo: Repository,
  fileName: string,
  fc: FileToCommit,
) {
  const data = new FormData();
  data.append('branch', fc.branch);
  data.append('message', fc.message);

  data.append('content', fc.content);

  cy.request({
    method: 'PUT',
    url: `http://${Cypress.env('BITBUCKET_HOST')}/rest/api/latest/projects/${
      project.key
    }/repos/${repo.name}/browse/${fc.name}`,
    auth: {
      user: 'esback',
      pass: 'esback',
    },
    headers: {
      'User-Agent': 'test-agent',
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  }).then(() => {
    cy.log('Catalog file pushed');
  });
}

function createRepository(project: Project): Repository {
  const repo = {
    slug: faker.random.alpha({ count: 5, casing: 'upper' }),
    name: faker.random.alphaNumeric(10),
    scmId: 'git',
  };

  cy.request({
    method: 'POST',
    url: `http://${Cypress.env('BITBUCKET_HOST')}/rest/api/latest/projects/${
      project.key
    }/repos`,
    auth: {
      user: 'esback',
      pass: 'esback',
    },
    headers: {
      'User-Agent': 'test-agent',
    },
    body: repo,
  }).then(() => {
    cy.log(`repository ${repo.name} created (slug: ${repo.slug})`);
  });

  return repo;
}

function createProject(): Project {
  const project = {
    key: faker.random.alpha({ count: 5, casing: 'upper' }),
    name: faker.random.alphaNumeric(10),
  };
  cy.request({
    method: 'POST',
    url: `http://${Cypress.env('BITBUCKET_HOST')}/rest/api/latest/projects`,
    auth: {
      user: 'esback',
      pass: 'esback',
    },
    headers: {
      'User-Agent': 'test-agent',
    },
    body: project,
    failOnStatusCode: false,
  }).then(() => {
    cy.log(`Project ${project.name} created (key: ${project.key})`);
  });
  return project;
}

function addCatalogLocation(project: Project, repo: Repository, path: string) {
  cy.request({
    method: 'POST',
    url: `/api/catalog/locations`,
    headers: {
      'User-Agent': 'test-agent',
      'Content-Type': 'application/json',
    },
    body: {
      type: 'url',
      target: path,
    },
  }).then(() => {
    cy.log('file added to repository');
  });
}
