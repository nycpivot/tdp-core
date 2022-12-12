describe('RRV Plugin', () => {
  it('should render the runtime resources and the pod logs', () => {
    cy.visit('/');
    cy.contains(/tap-gui-component/i).click();
    cy.contains(/runtime resources/i).click();
    cy.contains(/resources \(2\)/i);
    cy.get('table').contains('tr', 'Pod').children().first().next().click();
    cy.contains(/view pod logs/i).click();
    cy.contains(/view pod details/i).should('be.visible');
    cy.get('[role=row]')
      .filter(':visible')
      .should('have.length.greaterThan', 1)
      .contains('level')
      .should('be.visible');
  });
});
