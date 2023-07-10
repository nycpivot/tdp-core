import {Authentication} from "../support/authentication";

describe('Snyk v2.0.0 in TPB v1.6.0', () => {
    beforeEach(() => {
        Authentication.logInAsCatalogAdmin();
        cy.visit('/catalog');
    })
    it('displays the Snyk Overview card on the Entity overview', () => {
        cy.contains('Catalog');

        cy.contains('snyk-test-service');

        cy.intercept('GET', 'api/proxy/snyk/rest/orgs/883c2d65-1170-40d8-bf5c-bbba4a13eec1/targets*', {
            fixture: '../fixtures/snyk/targets.json'
        }).as('getTargets');

        cy.get('td[value="snyk-test-service"]')
            .should('be.visible')
            .children('a')
            .click();
        cy.wait('@getTargets')
        cy.contains('Vulnerabilities').should('be.visible');
        cy.get('[data-test-id="CircularProgressbarWithChildren"]').should('be.visible');
    })
});

