import { Authentication } from '../support/authentication';

describe('OIDC Auth Plugins', () => {
  describe('frontend plugin', () => {
    it('allows the user to authenticate with oidc', () => {
      cy.visit('/');
      cy.window().then(win => {
        cy.stub(win, 'open', url => {
          win.location.href = url;
        }).as('popup');
      });
      cy.contains('custom OIDC provider');
      cy.contains('customized in appconfig.e2e.yaml');
      cy.contains('li', 'OIDC').find('button').click();
      cy.get('@popup').should('be.called');
      cy.contains('VMware GitLab Enterprise Edition');
    });
  });

  describe('backend plugin', () => {
    // can't be tested without actual account
  });
});
