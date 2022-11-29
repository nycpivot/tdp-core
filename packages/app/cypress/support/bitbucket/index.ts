import { faker } from '@faker-js/faker';

export namespace Bitbucket {
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

  export function commitContent(
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

  export function createRepository(project: Project): Repository {
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

  export function createProject(): Project {
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
}
