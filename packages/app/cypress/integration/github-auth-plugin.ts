import { Authentication } from '../support/authentication';

describe('GitHub Auth Plugins', () => {
  describe('frontend plugin', () => {
    it('allows the user to authenticate with GitHub', () => {
      cy.visit('/');
      cy.window().then(win => {
        cy.stub(win, 'open', url => {
          win.location.href = url;
        }).as('popup');
      });
      cy.contains('li', 'GitHub').find('button').click();
      cy.get('@popup').should('be.called');
      cy.contains('Tanzu Portal Builder');
    });
  });

  describe('backend plugin', () => {
    it('should display user email in the settings', () => {
      Authentication.githubLogin();
      cy.visit('/settings');
      cy.contains('svctpb');
    });
  });
});
