export namespace Catalog {
  export function addCatalogLocation(path: string) {
    cy.request({
      method: 'POST',
      url: `/api/catalog/locations`,
      headers: {
        'User-Agent': 'test-agent',
        'Content-Type': 'application/json',
      },
      body: {
        type: 'url',
        target: path,
      },
    }).then(() => {
      cy.log('file added to repository');
    });
  }
}
