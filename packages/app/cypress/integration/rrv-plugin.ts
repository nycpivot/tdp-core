describe('RRV Plugin', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render the runtime resources and the pod logs', () => {
    cy.contains(/tap-gui-component/i).click();
    cy.contains(/runtime resources/i).click();
    cy.contains('tr', /pod/i)
      .children()
      .contains(/server/i)
      .click();
    cy.contains(/view pod logs/i).click();
    cy.contains(/view pod details/i).should('be.visible');
    cy.get('[role=row]')
      .filter(':visible')
      .should('have.length.greaterThan', 1)
      .contains('level')
      .should('be.visible');
  });

  it('should render the app live view', () => {
    cy.contains(/tanzu-java-web-app/i).click();
    cy.contains(/runtime resources/i).click();
    cy.contains('tr', /pod/i)
      .children()
      .contains(/tanzu-java-web-app/i)
      .click();
    cy.contains(/live view/i).should('be.visible');
    cy.contains('tr', /application name/i)
      .children('td')
      .last()
      .contains('tanzu-java-web-app');
    cy.contains('tr', /framework/i)
      .children('td')
      .last()
      .contains(/spring boot/i);
  });
});
