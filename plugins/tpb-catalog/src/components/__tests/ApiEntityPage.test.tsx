import React from 'react';
import { screen } from '@testing-library/react';
import { EntityPageSurface } from '../../EntityPageSurface';
import { Grid } from '@material-ui/core';
import { EntityLayout } from '@backstage/plugin-catalog';
import userEvent from '@testing-library/user-event';
import { renderTestEntityPage } from './test_helpers';

describe('API Page', () => {
  const testEntity = buildTestEntity(
    'api',
    {
      type: 'openapi',
      lifecycle: 'production',
      owner: 'artist-relations-team',
    },
    {
      name: 'artist-api',
      description: 'Retrieve artist details',
    },
  );

  it('should render the overview tab', async () => {
    const surface = new EntityPageSurface();

    await renderTestEntityPage(testEntity, surface);

    expect((await screen.findAllByText(/openapi/i)).length).toBeGreaterThan(1);
    expect(await screen.findByText(/artist-api/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Retrieve artist details/i),
    ).toBeInTheDocument();
  });

  it('can customize the overview tab', async () => {
    const surface = new EntityPageSurface();
    surface.apiPage.addOverviewContent(<div>i am a new overview element</div>);

    await renderTestEntityPage(testEntity, surface);

    expect(
      await screen.findByText(/i am a new overview element/i),
    ).toBeInTheDocument();
  });

  it('should render new tabs', async () => {
    const surface = new EntityPageSurface();
    surface.apiPage.addTab(
      <EntityLayout.Route path="/new-tab" title="New Tab">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div>I am a new api tab</div>
          </Grid>
        </Grid>
      </EntityLayout.Route>,
    );

    await renderTestEntityPage(testEntity, surface);
    userEvent.click(screen.getByText(/new tab/i));

    expect(await screen.findByText(/i am a new api tab/i)).toBeInTheDocument();
  });
});
