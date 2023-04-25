import React from 'react';
import { screen } from '@testing-library/react';
import { EntityPageSurface } from '../../EntityPageSurface';
import { Grid } from '@material-ui/core';
import { EntityLayout } from '@backstage/plugin-catalog';
import userEvent from '@testing-library/user-event';
import { buildTestEntity, renderTestEntityPage } from './test_helpers';

describe('Website Page', () => {
  const testEntity = buildTestEntity(
    'component',
    {
      type: 'website',
      lifecycle: 'production',
      system: 'artist-engagement-portal',
      dependsOn: ['resource: default/artists-db'],
      providesApis: ['artist-api'],
    },
    {
      name: 'artist-web',
      description: 'The great artist website',
    },
  );

  it('should render the overview tab', async () => {
    const surface = new EntityPageSurface();

    await renderTestEntityPage(testEntity, surface);

    expect(await screen.findByText('component — website')).toBeInTheDocument();
    expect(await screen.findByText(/artist-web/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/the great artist website/i),
    ).toBeInTheDocument();
    expect(await screen.queryByText(/API/)).not.toBeInTheDocument();
  });

  it('should render new tabs', async () => {
    const surface = new EntityPageSurface();
    surface.websitePage.addTab(
      <EntityLayout.Route path="/new-tab" title="New Tab">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div>I am a new website tab</div>
          </Grid>
        </Grid>
      </EntityLayout.Route>,
    );

    await renderTestEntityPage(testEntity, surface);
    userEvent.click(screen.getByText(/new tab/i));

    expect(
      await screen.findByText(/i am a new website tab/i),
    ).toBeInTheDocument();
  });
});
