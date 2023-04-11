import { Authentication } from '../support/authentication';

describe('AWS S3 Discovery Processor Plugin', () => {
  beforeEach(() => {
    Authentication.logInAsCatalogAdmin();
  });

  it('should display catalog entities imported from S3', () => {
    cy.get('[placeholder=Filter]').type('aws-s3');
    cy.contains(/aws-s3-discovery-processor-integration-component/i).should(
      'be.visible',
    );
  });
});
