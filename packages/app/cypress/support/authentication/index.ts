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
    cy.setCookie(
      'auth0-refresh-token',
      Cypress.env('AUTH0_SVC_TPB_REFRESH_TOKEN'),
    );
  }

  export function bitbucketLogin() {
    window.localStorage.setItem(
      '@backstage/core:SignInPage:provider',
      'bitbucket-auth-provider',
    );
    cy.setCookie(
      'bitbucket-refresh-token',
      Cypress.env('BITBUCKET_SVC_TPB_REFRESH_TOKEN'),
    );
  }

  export function googleSvcTpbLogin() {
    window.localStorage.setItem(
      '@backstage/core:SignInPage:provider',
      'google-auth-provider',
    );
    cy.setCookie(
      'google-refresh-token',
      Cypress.env('GOOGLE_SVC_TPB_REFRESH_TOKEN'),
    );
  }

  export function googleLogout() {
    cy.clearCookie('google-refresh-token');
  }

  export function permissionTestLogin() {
    window.localStorage.setItem(
      '@backstage/core:SignInPage:provider',
      'permission-test',
    );
    cy.setCookie(
      'permission-test-refresh-token',
      Cypress.env('GOOGLE_USER_A_REFRESH_TOKEN'),
    );
  }

  export const logInAsCatalogAdmin = () => {
    cy.visit('/');
    guestLogin();
  };

  export function catalogAdminLogout() {
    cy.clearCookie('github-refresh-token');
  }

  export function githubLogin() {
    window.localStorage.setItem(
      '@backstage/core:SignInPage:provider',
      'github-auth-provider',
    );
    cy.setCookie(
      'github-refresh-token',
      Cypress.env('GITHUB_SVC_TPB_REFRESH_TOKEN'),
    );
  }

  export function oktaLogin() {
    window.localStorage.setItem(
      '@backstage/core:SignInPage:provider',
      'okta-auth-provider',
    );
    cy.setCookie(
      'okta-refresh-token',
      Cypress.env('OKTA_SVC_TPB_REFRESH_TOKEN'),
    );
  }
}
