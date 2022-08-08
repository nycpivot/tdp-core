import React from "react";
import {
  EntitySwitch,
  EntityOrphanWarning,
  EntityProcessingErrorsPanel,
  hasCatalogProcessingErrors,
  isOrphan,
} from '@backstage/plugin-catalog';
import { Grid } from '@material-ui/core';

export const EntityWarningContent: React.FC = () => (
  <>
    <EntitySwitch>
      <EntitySwitch.Case if={isOrphan}>
        <Grid item xs={12}>
          <EntityOrphanWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={hasCatalogProcessingErrors}>
        <Grid item xs={12}>
          <EntityProcessingErrorsPanel />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </>
);