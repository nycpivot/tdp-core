import React from 'react';
import {
  StandardProps,
  StyleRulesCallback,
  Theme,
  withStyles,
} from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';

export type BannerClassKey = 'root' | 'text' | 'link';

export interface BannerProps
  extends StandardProps<React.HTMLAttributes<HTMLDivElement>, BannerClassKey> {
  value?: {
    text?: string;
    color?: string;
    link?: string;
    linkText?: string;
    bg?: string;
  };
}

const styles: StyleRulesCallback<BackstageTheme, BannerProps, BannerClassKey> =
  () => ({
    root: {
      display: 'flex',
      padding: '0 1rem',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      textAlign: 'center',
      height: '36px',
      lineHeight: '36px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      paddingRight: '1rem',
      textOverflow: 'ellipsis',
    },
    link: {
      textDecoration: 'none',
      lineHeight: '36px',
      whiteSpace: 'nowrap',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  });

const BannerComponent = (props: BannerProps) => {
  const style = {
    color: props?.value?.color ? props?.value?.color : '#FFFFFF',
    backgroundColor: props?.value?.bg ? props?.value?.bg : '#c23b2e',
  };
  if (!props?.value?.text) {
    return <></>;
  }
  return (
    <div style={style} className={props.classes?.root}>
      <div className={props.classes?.text}>{props?.value?.text}</div>
      {props?.value?.link && (
        <>
          <a
            style={style}
            className={props.classes?.link}
            href={props?.value?.link}
          >
            {props?.value?.linkText || 'Read more'}
          </a>
        </>
      )}
    </div>
  );
};

export const Banner = withStyles<BannerClassKey>(
  styles as StyleRulesCallback<Theme, BannerProps, BannerClassKey>,
  { name: 'Banner' },
)(BannerComponent);
