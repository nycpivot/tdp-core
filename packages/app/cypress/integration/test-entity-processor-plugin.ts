import { Authentication } from '../support/authentication';

describe('Custom processor plugin', () => {
  beforeEach(() => {
    Authentication.guestLogin();
  });

  it('should render custom processor entity', () => {
    cy.visit('/');
    cy.contains('Custom Processor Entity');
  });
});
