import React from 'react';
import { screen } from '@testing-library/react';
import { EntityPageSurface } from '../../EntityPageSurface';
import { Grid } from '@material-ui/core';
import { EntityLayout } from '@backstage/plugin-catalog';
import userEvent from '@testing-library/user-event';
import { buildTestEntity, renderTestEntityPage } from './test_helpers';

describe('System Page', () => {
  const testEntity = buildTestEntity(
    'system',
    {
      domain: 'artists-domain',
      owner: 'artist-relations-team',
    },
    {
      name: 'artist-engagement-portal',
      description: 'Handy tools to keep artists in the loop',
    },
  );

  it('should render the overview tab', async () => {
    const surface = new EntityPageSurface();

    await renderTestEntityPage(testEntity, surface);

    expect(
      await screen.findByText(/artist-engagement-portal/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Handy tools to keep artists in the loop/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/no component is part of this system/i),
    ).toBeInTheDocument();
  });

  it('should render new tabs', async () => {
    const surface = new EntityPageSurface();
    surface.systemPage.addTab(
      <EntityLayout.Route path="/new-tab" title="New Tab">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div>I am a new system tab</div>
          </Grid>
        </Grid>
      </EntityLayout.Route>,
    );

    await renderTestEntityPage(testEntity, surface);
    userEvent.click(screen.getByText(/new tab/i));

    expect(
      await screen.findByText(/i am a new system tab/i),
    ).toBeInTheDocument();
  });
});
