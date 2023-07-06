import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

export interface QuickLinkIconProps {
  icon?: string;
  label: string;
}

const useStyles = makeStyles(() => ({
  quickLinkImage: {
    width: '64px',
    height: '64px',
  },
}));

function QuickLinkIcon(props: QuickLinkIconProps) {
  const { icon, label } = props;
  const classes = useStyles();

  return (
    <img
      src={`data:image/svg+xml;base64,${icon}`}
      alt={label}
      className={classes.quickLinkImage}
    />
  );
}

export default QuickLinkIcon;
