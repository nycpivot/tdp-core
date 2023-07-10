import React from 'react';
import {
  HomePageStarredEntities,
  CustomHomepageGrid,
  HomePageCompanyLogo,
  HomePageToolkit,
  Tool,
} from '@backstage/plugin-home';
import { HomePageSearchBar } from '@backstage/plugin-search';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import QuickLinkIcon from '../components/QuickLinkIcon';
import { HomePageWelcomeMessage } from '../components/HomePageWelcomeMessage';
import { HomeSurface } from '../HomeSurface';

export type HomePageProps = {
  surface: HomeSurface;
};

type QuickLink = {
  url: string;
  label: string;
  icon?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    '& > :first-child': {
      height: 'auto',
      marginTop: '10px',
      marginLeft: '-20px',
      marginRight: '-20px',
      marginBottom: '10px',
    },
  },
  logo: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    margin: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'center',
  },
  searchBarContainer: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '50px !important',
    boxShadow: theme.shadows[1],
    padding: theme.spacing(0, 2),
    borderStyle: 'none !important',
  },
}));

function HomePage(props: HomePageProps) {
  const { surface } = props;
  const classes = useStyles();
  const config = useApi(configApiRef);
  const logo = config.getOptionalString('customize.features.home.logo');
  const logoSrc = `data:image/svg+xml;base64,${logo}`;

  const quickLinks =
    config.getOptional<QuickLink[]>('customize.features.home.quickLinks') || [];
  const parsedLinks: Tool[] = quickLinks.map(({ url, label, icon }) => {
    return {
      url,
      label,
      icon: icon && <QuickLinkIcon icon={icon} label={label} />,
    };
  });

  const defaultConfig = [
    {
      component: 'CompanyLogo',
      x: 0,
      y: 0,
      width: 12,
      height: 8,
    },
    {
      component: 'HomePageWelcomeMessage',
      x: 0,
      y: 13,
      width: 12,
      height: 4,
    },
    {
      component: 'HomePageSearchBar',
      x: 2,
      y: 16,
      width: 8,
      height: 5,
    },
    {
      component: 'HomePageStarredEntities',
      x: 0,
      y: 18,
      width: 6,
      height: 12,
    },
    {
      component: 'HomePageToolkit',
      x: 7,
      y: 18,
      width: 6,
      height: 12,
    },
  ];

  // Fix for `CustomHomePageGrid` bug — lacks `xl` value definition and crashes on big screens
  const breakpoints = { xl: 12, lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

  return (
    <div className={classes.content}>
      <CustomHomepageGrid
        config={defaultConfig}
        rowHeight={10}
        breakpoints={breakpoints}
      >
        <HomePageCompanyLogo
          className={classes.container}
          logo={
            <img src={logoSrc} alt="Company Logo" className={classes.logo} />
          }
        />
        <HomePageWelcomeMessage />
        <HomePageSearchBar
          className={classes.searchBarContainer}
          placeholder="Search"
        />
        <HomePageStarredEntities />
        <HomePageToolkit title="Quick Links" tools={parsedLinks} />
        {surface.widgets}
      </CustomHomepageGrid>
      {surface.content}
    </div>
  );
}

export default HomePage;
