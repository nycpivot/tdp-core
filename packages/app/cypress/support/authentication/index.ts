export namespace Authentication {
  export function guestLogin() {
    cy.visit('/');
    cy.get('button').contains('Enter').click();
  }

  export function googleUserALogin() {
    cy.setCookie('google-refresh-token', Cypress.env('GOOGLE_USER_A_REFRESH_TOKEN'));
  }
}
