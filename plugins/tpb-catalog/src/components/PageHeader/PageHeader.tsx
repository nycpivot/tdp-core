import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { BackstageTheme } from '@backstage/theme';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import React, { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Breadcrumbs } from '@backstage/core-components';

const useStyles = makeStyles<BackstageTheme>(
  theme => ({
    header: {
      gridArea: 'pageHeader',
      padding: theme.spacing(3),
      width: '100%',
      boxShadow: '0 0 8px 3px rgba(20, 20, 20, 0.3)',
      position: 'relative',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      backgroundImage: theme.page.backgroundImage,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    },
    leftItemsBox: {
      maxWidth: '100%',
      flexGrow: 1,
    },
    rightItemsBox: {
      width: 'auto',
    },
    title: {
      color: theme.palette.bursts.fontColor,
      wordBreak: 'break-all',
      fontSize: 'calc(24px + 6 * ((100vw - 320px) / 680))',
      marginBottom: 0,
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: '1.0em',
      display: 'inline-block', // prevents margin collapse of adjacent siblings
      marginTop: theme.spacing(1),
    },
    type: {
      textTransform: 'uppercase',
      fontSize: 11,
      opacity: 0.8,
      marginBottom: theme.spacing(1),
      color: theme.palette.bursts.fontColor,
    },
    breadcrumb: {
      fontSize: 'calc(15px + 1 * ((100vw - 320px) / 680))',
      color: theme.palette.bursts.fontColor,
    },
    breadcrumbType: {
      fontSize: 'inherit',
      opacity: 0.7,
      marginRight: -theme.spacing(0.3),
      marginBottom: theme.spacing(0.3),
    },
    breadcrumbTitle: {
      fontSize: 'inherit',
      marginLeft: -theme.spacing(0.3),
      marginBottom: theme.spacing(0.3),
    },
  }),
  { name: 'BackstageHeader' },
);

type HeaderStyles = ReturnType<typeof useStyles>;

type Props = {
  component?: ReactNode;
  pageTitleOverride?: string;
  style?: CSSProperties;
  subtitle?: ReactNode;
  title: ReactNode;
  tooltip?: string;
  type?: ReactNode;
  typeLink?: string;
};

type TypeFragmentProps = {
  classes: HeaderStyles;
  pageTitle: string | ReactNode;
  type?: Props['type'];
  typeLink?: Props['typeLink'];
};

type TitleFragmentProps = {
  classes: HeaderStyles;
  pageTitle: string | ReactNode;
  tooltip?: Props['tooltip'];
};

type SubtitleFragmentProps = {
  classes: HeaderStyles;
  subtitle?: Props['subtitle'];
};

const TypeFragment = ({
  type,
  typeLink,
  classes,
  pageTitle,
}: TypeFragmentProps) => {
  if (!type) {
    return null;
  }

  if (!typeLink) {
    return <Typography className={classes.type}>{type}</Typography>;
  }

  return (
    <Breadcrumbs className={classes.breadcrumb}>
      <Link to={typeLink}>{type}</Link>
      <Typography>{pageTitle}</Typography>
    </Breadcrumbs>
  );
};

const TitleFragment = ({ pageTitle, classes, tooltip }: TitleFragmentProps) => {
  const FinalTitle = (
    <Typography className={classes.title} variant="h1">
      {pageTitle}
    </Typography>
  );

  if (!tooltip) {
    return FinalTitle;
  }

  return (
    <Tooltip title={tooltip} placement="top-start">
      {FinalTitle}
    </Tooltip>
  );
};

const SubtitleFragment = ({ classes, subtitle }: SubtitleFragmentProps) => {
  if (!subtitle) {
    return null;
  }

  if (typeof subtitle !== 'string') {
    return <>{subtitle}</>;
  }

  return (
    <Typography
      className={classes.subtitle}
      variant="subtitle2"
      component="span"
    >
      {subtitle}
    </Typography>
  );
};

export function PageHeader(props: PropsWithChildren<Props>) {
  const {
    children,
    pageTitleOverride,
    style,
    subtitle,
    title,
    tooltip,
    type,
    typeLink,
  } = props;
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptionalString('app.title') || 'Backstage';
  const documentTitle = pageTitleOverride || title;
  const pageTitle = title || pageTitleOverride;
  const titleTemplate = `${documentTitle} | %s | ${appTitle}`;
  const defaultTitle = `${documentTitle} | ${appTitle}`;

  return (
    <>
      <Helmet titleTemplate={titleTemplate} defaultTitle={defaultTitle} />
      <header style={style} className={classes.header}>
        <Box className={classes.leftItemsBox}>
          <TypeFragment
            classes={classes}
            type={type}
            typeLink={typeLink}
            pageTitle={pageTitle}
          />
          <TitleFragment
            classes={classes}
            pageTitle={pageTitle}
            tooltip={tooltip}
          />
          <SubtitleFragment classes={classes} subtitle={subtitle} />
        </Box>
        <Grid container className={classes.rightItemsBox} spacing={4}>
          {children}
        </Grid>
      </header>
    </>
  );
}
