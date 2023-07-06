import {Authentication} from "../support/authentication";

describe('Snyk v2.0.0 in TPB v1.6.0', () => {
    beforeEach(() => {
        Authentication.logInAsCatalogAdmin();
        cy.visit('/catalog');
    })
});

