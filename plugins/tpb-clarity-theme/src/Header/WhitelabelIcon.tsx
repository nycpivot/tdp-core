import React from 'react';
import {
  StandardProps,
  StyleRulesCallback,
  Theme,
  withStyles,
} from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import { useNavigate } from 'react-router-dom';

export type WhitelabelIconClassKey = 'root' | 'img';

export interface WhitelabelIconProps
  extends StandardProps<
    React.HTMLAttributes<HTMLImageElement>,
    WhitelabelIconClassKey
  > {
  base64PNG: string;
  alt?: string;
}

const styles: StyleRulesCallback<
  BackstageTheme,
  WhitelabelIconProps,
  WhitelabelIconClassKey
> = (_: BackstageTheme) => ({
  root: {
    display: 'flex',
    width: '1.8rem',
    height: '1.8rem',
    marginRight: '10px',
  },
  img: {
    width: '100%',
    height: '100%',
  },
});

const WhitelabelIcon = (props: WhitelabelIconProps) => {
  const navigate = useNavigate();
  const navigateHome = () => navigate('/');
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={navigateHome}
      onKeyDown={navigateHome}
      className={props.classes?.root}
    >
      <img
        src={`data:image/png;base64,${props.base64PNG}`}
        alt={props?.alt ? props?.alt : 'whitelabel logo'}
      />
    </span>
  );
};

export default withStyles<WhitelabelIconClassKey>(
  styles as StyleRulesCallback<Theme, {}, WhitelabelIconClassKey>,
  { name: 'ClarityWhitelabelIcon' },
)(WhitelabelIcon);
