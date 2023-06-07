import { Authentication } from '../support/authentication';

// As defined in https://gitlab.eng.vmware.com/esback/core/-/blob/main/plugins/tpb-clarity-theming/src/Header/Banner.tsx
// And as used in https://gitlab.eng.vmware.com/esback/core/-/blob/main/plugins/tpb-clarity-theming/src/Root/Root.tsx
describe('Banners', () => {
  beforeEach(() => {
    cy.visit('/');
    Authentication.guestLogin();
  });

  it('should render the banner twice', () => {
    cy.get('div')
      .filter((_, element) => {
        return element.innerText === 'TPB E2E Test Banner';
      })
      .should('have.length', '4');
  });
});
