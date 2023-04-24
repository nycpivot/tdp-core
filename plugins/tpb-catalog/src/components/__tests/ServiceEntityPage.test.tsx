import React from 'react';
import { screen } from '@testing-library/react';
import { EntityPageSurface } from '../../EntityPageSurface';
import { Grid } from '@material-ui/core';
import { EntityLayout } from '@backstage/plugin-catalog';
import userEvent from '@testing-library/user-event';
import { renderTestEntityPage } from './test_helpers';

describe('System Page', () => {
  const testEntity = buildTestEntity(
    'component',
    {
      type: 'service',
      lifecycle: 'production',
      system: 'artist-engagement-portal',
      dependsOn: ['resource: default/artists-db'],
      providesApis: ['artist-api'],
    },
    {
      name: 'artist-service',
      description: 'The great artist service',
    },
  );

  it('should render the overview tab', async () => {
    const surface = new EntityPageSurface();

    await renderTestEntityPage(testEntity, surface);

    expect(await screen.findByText('component — service')).toBeInTheDocument();
    expect(await screen.findByText(/artist-service/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/the great artist service/i),
    ).toBeInTheDocument();
    expect(await screen.findByText(/API/)).toBeInTheDocument();
  });

  it('should render new tabs', async () => {
    const surface = new EntityPageSurface();
    surface.addServicePageTab(
      <EntityLayout.Route path="/new-tab" title="New Tab">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div>I am a new service tab</div>
          </Grid>
        </Grid>
      </EntityLayout.Route>,
    );

    await renderTestEntityPage(testEntity, surface);
    userEvent.click(screen.getByText(/new tab/i));

    expect(
      await screen.findByText(/i am a new service tab/i),
    ).toBeInTheDocument();
  });
});
