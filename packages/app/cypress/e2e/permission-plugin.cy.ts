import { Authentication } from '../support/authentication';

describe('Permission Plugin', () => {
  const visibilityMatrix = {
    'user-a': {
      'component-a': true,
      'component-b': false,
      'component-c': true,
      'component-d': false,
    },
    'user-b': {
      'component-a': false,
      'component-b': true,
      'component-c': true,
      'component-d': false,
    },
    'user-c': {
      'component-a': true,
      'component-b': true,
      'component-c': true,
      'component-d': true,
    },
    'user-d': {
      'component-a': true,
      'component-b': true,
      'component-c': true,
      'component-d': true,
    },
  };

  const logInAs = (username: string) => {
    Authentication.permissionTestLogin();
    cy.visit('/settings');
    cy.contains('User Entity').contains(username).should('exist');
  };

  const viewAllComponents = () => {
    cy.get('[aria-label="Home"]').should('be.visible').click();
    cy.get('[aria-label="VMware"]')
      .find('[role="menuitem"]')
      .contains('All')
      .click();
  };

  for (const [user, componentVisibility] of Object.entries(visibilityMatrix)) {
    describe(`Log in as ${user}`, () => {
      it('should see some components after logging in', () => {
        logInAs(user);
        viewAllComponents();
        for (const [component, isVisible] of Object.entries(
          componentVisibility,
        )) {
          if (isVisible) {
            cy.contains(component).should('exist');
          } else {
            cy.contains(component).should('not.exist');
          }
        }
      });
    });
  }
});
