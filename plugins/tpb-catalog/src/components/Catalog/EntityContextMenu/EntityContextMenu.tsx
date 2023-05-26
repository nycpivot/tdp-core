import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MoreVert from '@material-ui/icons/MoreVert';
import React, { useState } from 'react';
import { IconComponent } from '@backstage/core-plugin-api';
import { catalogEntityDeletePermission } from '@backstage/plugin-catalog-common/alpha';
import { useEntityPermission } from '@backstage/plugin-catalog-react/alpha';
import UninstallLogoIcon from './UninstallLogoIcon';

const useStyles = makeStyles(theme => ({
  button: {
    color:
      theme.palette.type === 'light'
        ? theme.palette.grey[700]
        : theme.palette.grey[300],
  },
}));

// NOTE(freben): Intentionally not exported at this point, since it's part of
// the unstable extra context menu items concept below
type ExtraContextMenuItem = {
  title: string;
  Icon: IconComponent;
  onClick: () => void;
};

// unstable context menu option, eg: disable the unregister entity menu
type contextMenuOptions = {
  disableUnregister: boolean;
};

type Props = {
  UNSTABLE_extraContextMenuItems?: ExtraContextMenuItem[];
  UNSTABLE_contextMenuOptions?: contextMenuOptions;
  onUnregisterEntity: () => void;
  entityKind: string;
};

export const EntityContextMenu = ({
  UNSTABLE_extraContextMenuItems,
  UNSTABLE_contextMenuOptions,
  onUnregisterEntity,
  entityKind,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const classes = useStyles();
  const unregisterPermission = useEntityPermission(
    catalogEntityDeletePermission,
  );

  const onOpen = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(undefined);
  };

  const extraItems = UNSTABLE_extraContextMenuItems && [
    ...UNSTABLE_extraContextMenuItems.map(item => (
      <MenuItem
        key={item.title}
        onClick={() => {
          onClose();
          item.onClick();
        }}
      >
        <ListItemIcon>
          <item.Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={item.title} />
      </MenuItem>
    )),
    <Divider key="the divider is here!" />,
  ];

  const disableUnregister =
    (!unregisterPermission.allowed ||
      UNSTABLE_contextMenuOptions?.disableUnregister) ??
    false;

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        aria-expanded={!!anchorEl}
        role="button"
        onClick={onOpen}
        data-testid="menu-button"
        className={classes.button}
        id="long-menu"
      >
        <MoreVert />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        aria-labelledby="long-menu"
      >
        <MenuList>
          {extraItems}
          <MenuItem
            onClick={() => {
              onClose();
              onUnregisterEntity();
            }}
            disabled={disableUnregister}
          >
            <ListItemIcon>
              <UninstallLogoIcon />
            </ListItemIcon>
            <ListItemText primary={`Unregister ${entityKind}`} />
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
};
