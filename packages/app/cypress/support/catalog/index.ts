export namespace Catalog {
  export function addCatalogLocation(type: string, target: string) {
    cy.request({
      method: 'POST',
      url: `/api/catalog/locations`,
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
