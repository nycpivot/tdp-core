/* eslint-disable @typescript-eslint/no-use-before-define */
import { Authentication } from '../support/authentication';

// As defined in https://gitlab.eng.vmware.com/esback/core/-/blob/main/plugins/tpb-clarity-theming/src/Header/Banner.tsx
// And as used in https://gitlab.eng.vmware.com/esback/core/-/blob/main/plugins/tpb-clarity-theming/src/Root/Root.tsx
describe('Banners', () => {
  beforeEach(() => {
    cy.visit('/');
    Authentication.guestLogin();
  });

  it('should render the custom title', () => {
    cy.contains('h1', 'My Custom TAP Portal').should('exist');
  });

  it('should render the custom icon', () => {
    cy.get(`span[role="button"] > img[src^="${imageData}"]`).should('exist');
  });
});

// abbreviated image data. I truncated the image data in order to make the test
// easier to read (and the file easier to edit)
const imageData =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAIABJREFUeJzs3Xd8HOd56PvfNmDReyEKAZAEQIJg712sKpSsYhVbsmRLitwSlyQnJ8m5p+Tc3Jtyj524xI6bHFuyZEuWbPVGFUoiRVLsBAtIgiQqQfS6wGLr/QMiQ7HutJ0d7PP9fPZjf4R5Zp7l7s48877vvK8NIYRaecAcYBpQ/smrEMj55OX+5JVkTnqWNwp4P3n1fPI6B5wBGoEG4BDQZVJ+QliazewEhLAIOzAbWAusAxYyfrEX5jsH7AbeBd5jvCgIm5qREBYgBYAQV1cM3M74Rf8GINfUbESkuoGtjBcELwFtpmYjh';
