import React from 'react';
import { screen } from '@testing-library/react';
import { EntityPageSurface } from '../../EntityPageSurface';
import {
  isComponentType,
  isKind,
  EntitySwitch,
} from '@backstage/plugin-catalog';
import { renderTestEntityPage } from './test_helpers';

describe('Custom Component Page', () => {
  const testEntity = buildTestEntity('component', {
    type: 'foo',
  });

  it('should render the custom page', async () => {
    const surface = new EntityPageSurface();
    surface.addComponentPageCase(
      <EntitySwitch.Case if={isKind('component') && isComponentType('foo')}>
        <div>i am foo</div>
      </EntitySwitch.Case>,
    );

    await renderTestEntityPage(testEntity, surface);

    expect(await screen.findByText(/i am foo/i)).toBeInTheDocument();
  });
});
