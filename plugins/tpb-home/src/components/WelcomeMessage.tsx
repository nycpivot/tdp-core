import React from 'react';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    margin: theme.spacing(1, 0),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export function WelcomeMessage() {
  const classes = useStyles();
  const config = useApi(configApiRef);
  const welcomeMessage = config.getOptionalString(
    'customize.features.home.welcomeMessage',
  );

  return (
    <div className={classes.container}>
      <Typography variant="h1">{welcomeMessage}</Typography>
    </div>
  );
}
