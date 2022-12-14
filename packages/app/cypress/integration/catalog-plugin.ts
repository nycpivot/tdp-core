import { Bitbucket } from '../support/bitbucket';
import { faker } from '@faker-js/faker';
import { Catalog } from '../support/catalog';

describe('Catalog Plugin', () => {
  it('should render the title', () => {
    cy.visit('/');
    cy.contains('VMware Catalog');
  });

  it('should render the local catalog', () => {
    cy.visit('/');
    cy.contains('example-website');
  });

  describe('Gitlab integration', () => {
    it('should render the gitlab catalog', () => {
      cy.visit('/');
      cy.contains('gitlab-integration-component');
    });
  });

  describe('Github integration', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should render the github catalog', () => {
      cy.contains('github-integration-component');
    });

    it('should render the github enterprise catalog', () => {
      cy.contains('github-enterprise-integration-component');
    });
  });

  describe('Bitbucket Server integration', () => {
    let componentName: string;

    beforeEach(() => {
      const project = Bitbucket.createProject();
      const repo = Bitbucket.createRepository(project);
      const catalogName = `${faker.random.alpha(10)}.yml`;

      componentName = `bitbucket-server-${faker.random.alpha(5)}`;

      cy.fixture('bitbucket-server/component.yaml').then(content => {
        const newContent = content.replace(
          'bitbucket-server-integration-component',
          componentName,
        );
        Bitbucket.commitContent(project, repo, catalogName, {
          name: catalogName,
          branch: 'master',
          message: 'my e2e catalog',
          content: newContent,
        });
        Catalog.addCatalogLocation(
          'url',
          `http://bitbucket:7990/projects/${project.key}/repos/${repo.name}/raw/${catalogName}`,
        );
      });
    });

    it('should render the bitbucket server catalog', () => {
      cy.visit('/');
      cy.reloadPageUntilElementVisible(() =>
        Cypress.$(`td:contains(${componentName})`),
      );
      cy.contains(componentName).should('be.visible');
    });
  });
});