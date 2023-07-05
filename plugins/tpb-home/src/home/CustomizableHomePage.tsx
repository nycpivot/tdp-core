import React from 'react';
import {
  HomePageStarredEntities,
  CustomHomepageGrid,
  HomePageCompanyLogo,
} from '@backstage/plugin-home';
// import { HomePageSearchBar } from '@backstage/plugin-search';
import logo from '../../docs/SigilLogo.png';
import { makeStyles } from '@material-ui/core/styles';
import { SearchContextProvider } from '@backstage/plugin-search-react';

const useStyles = makeStyles(() => ({
  content: {
    '& > :first-child': {
      height: 'auto',
      marginTop: '10px',
      marginLeft: '-20px',
      marginRight: '-20px',
      marginBottom: '10px',
    },
  },
}));

function CustomizableHomePage() {
  const classes = useStyles();
  const defaultConfig = [
    {
      component: 'HomePageSearchBar',
      x: 0,
      y: 0,
      width: 12,
      height: 5,
    },
    {
      component: 'HomePageRandomJoke',
      x: 0,
      y: 2,
      width: 6,
      height: 16,
    },
    {
      component: 'HomePageStarredEntities',
      x: 0,
      y: 2,
      width: 6,
      height: 12,
    },
  ];

  return (
    <SearchContextProvider>
      <div className={classes.content}>
        <CustomHomepageGrid config={defaultConfig} rowHeight={10}>
          <HomePageCompanyLogo logo={<img src={logo} alt="logo" />} />
          {/* <HomePageSearchBar /> */}
          <HomePageStarredEntities />
        </CustomHomepageGrid>
      </div>
    </SearchContextProvider>
  );
}

export default CustomizableHomePage;
