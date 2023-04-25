import React from 'react';
import { screen } from '@testing-library/react';
import { EntityPageSurface } from '../../EntityPageSurface';
import { Grid } from '@material-ui/core';
import { EntityLayout } from '@backstage/plugin-catalog';
import userEvent from '@testing-library/user-event';
import { buildTestEntity, renderTestEntityPage } from './test_helpers';

describe('Group Page', () => {
  const testEntity = buildTestEntity(
    'group',
    {
      type: 'business-unit',
      profile: {
        displayName: 'Infrastructure',
        email: 'infrastructure@example.com',
      },
      parent: 'ops',
      children: ['backstage', 'other'],
      members: ['jdoe'],
    },
    {
      name: 'infrastructure',
      description: 'The infra business unit',
    },
  );

  it('should render the overview tab', async () => {
    const surface = new EntityPageSurface();

    await renderTestEntityPage(testEntity, surface);

    expect(
      await screen.findByText(/group — business-unit/i),
    ).toBeInTheDocument();
    expect(await screen.findByText(/Infrastructure/)).toBeInTheDocument();
    expect(
      await screen.findByText(/The infra business unit/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/infrastructure@example.com/i),
    ).toBeInTheDocument();
    expect(await screen.findByText(/direct relations/i)).toBeInTheDocument();
  });

  it('should render new tabs', async () => {
    const surface = new EntityPageSurface();
    surface.groupPage.addTab(
      <EntityLayout.Route path="/new-tab" title="New Tab">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div>I am a new group tab</div>
          </Grid>
        </Grid>
      </EntityLayout.Route>,
    );

    await renderTestEntityPage(testEntity, surface);
    userEvent.click(screen.getByText(/new tab/i));

    expect(
      await screen.findByText(/i am a new group tab/i),
    ).toBeInTheDocument();
  });
});
