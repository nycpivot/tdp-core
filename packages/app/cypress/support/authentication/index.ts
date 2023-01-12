export namespace Authentication {
  export function guestLogin() {
    cy.visit('/');
    cy.get('button').contains('Enter').click();
  }

  export function googleUserALogin() {
    window.localStorage.setItem(
      '@backstage/core:SignInPage:provider',
      'google-auth-provider',
    );
    cy.setCookie(
      'google-refresh-token',
      Cypress.env('GOOGLE_USER_A_REFRESH_TOKEN'),
    );
  }

  export function googleLogout() {
    cy.clearCookie('google-refresh-token');
  }
}
