export namespace Authentication {
  export function guestLogin() {
    cy.visit('/');
    cy.get('button').contains('Enter').click();
  }

  export function auth0Login() {
    window.localStorage.setItem(
      '@backstage/core:SignInPage:provider',
      'auth0-auth-provider',
    );
    cy.setCookie('auth0-refresh-token', Cypress.env('AUTH0_REFRESH_TOKEN'));
  }

  export function bitbucketLogin() {
    window.localStorage.setItem(
      '@backstage/core:SignInPage:provider',
      'bitbucket-auth-provider',
    );
    cy.setCookie(
      'bitbucket-refresh-token',
      Cypress.env('BITBUCKET_JOHN_DOE_REFRESH_TOKEN'),
    );
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

  export function oktaLogin() {
    window.localStorage.setItem(
      '@backstage/core:SignInPage:provider',
      'okta-auth-provider',
    );
    cy.setCookie('okta-refresh-token', Cypress.env('OKTA_REFRESH_TOKEN'));
  }
}
