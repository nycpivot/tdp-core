export namespace Catalog {
  export function addCatalogLocation(type: string, target: string) {
    cy.log(`Adding catalog: ${target} on ${Cypress.env('ESBACK_BACKEND_URL')}`);
    cy.request({
      method: 'POST',
      url: `${Cypress.env('ESBACK_BACKEND_URL')}/api/catalog/locations`,
      headers: {
        'User-Agent': 'test-agent',
        'Content-Type': 'application/json',
      },
      body: {
        type: type,
        target: target,
      },
    }).then(() => {
      cy.log('file added to repository');
    });
  }
}
