import 'cypress-wait-until';

Cypress.Commands.add(
  'reloadPageUntilElementVisible',
  (query: () => JQuery<HTMLElement>) => {
    cy.waitUntil(
      () => {
        if (query().length === 1) {
          cy.log('Component already there');
          return true;
        }
        // eslint-disable-next-line cypress/no-unnecessary-waiting
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
  },
);
