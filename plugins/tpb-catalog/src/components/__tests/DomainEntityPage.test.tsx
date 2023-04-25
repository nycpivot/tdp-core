import React from 'react';
import { screen } from '@testing-library/react';
import { EntityPageSurface } from '../../EntityPageSurface';
import { Grid } from '@material-ui/core';
import { EntityLayout } from '@backstage/plugin-catalog';
import userEvent from '@testing-library/user-event';
import { buildTestEntity, renderTestEntityPage } from './test_helpers';

describe('Domain Page', () => {
  const testEntity = buildTestEntity(
    'domain',
    {
      owner: 'artist-relations-team',
    },
    {
      name: 'artists',
      description: 'Everything about artists',
    },
  );

  it('should render the overview tab', async () => {
    const surface = new EntityPageSurface();

    await renderTestEntityPage(testEntity, surface);

    expect(
      await screen.findByText(/Everything about artists/i),
    ).toBeInTheDocument();
    expect(await screen.findByText(/has systems/i)).toBeInTheDocument();
  });

  it('should render new tabs', async () => {
    const surface = new EntityPageSurface();
    surface.domainPage.addTab(
      <EntityLayout.Route path="/new-tab" title="New Tab">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div>I am a new domain tab</div>
          </Grid>
        </Grid>
      </EntityLayout.Route>,
    );

    await renderTestEntityPage(testEntity, surface);
    userEvent.click(screen.getByText(/new tab/i));

    expect(
      await screen.findByText(/i am a new domain tab/i),
    ).toBeInTheDocument();
  });
});
