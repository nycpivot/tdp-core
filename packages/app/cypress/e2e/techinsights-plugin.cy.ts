import { Authentication } from '../support/authentication';

const success_svg_path =
  'M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z';

const error_svg_path =
  'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z';

describe('TechInsights v0.3.11 in TPB v1.6.0', () => {
  beforeEach(() => {
    Authentication.guestLogin();
    cy.visit('/catalog');
  });

  it('displays the TechInsights tab on an entity details', () => {
    cy.contains('Catalog');
    cy.get('td[value="yelb-db"]').should('be.visible').children('a').click();
    cy.get('button[data-testid="header-tab-5"]')
      .should('be.visible')
      .contains('TechInsights')
      .click();

    cy.contains('Customized title for the scorecard').should('be.visible');
    cy.contains('Group Owner Check').should('be.visible');
    cy.contains('TechDocs Check').should('be.visible');
    cy.contains('Title Check').should('be.visible');

    cy.get('li:first')
      .children('svg')
      .children('path')
      .should('have.attr', 'd', success_svg_path);

    cy.get('li:nth-child(2)')
      .children('svg')
      .children('path')
      .should('have.attr', 'd', success_svg_path);

    cy.get('li:last')
      .children('svg')
      .children('path')
      .should('have.attr', 'd', error_svg_path);
  });
});
