import React from 'react';
import {
  HomePageStarredEntities,
  CustomHomepageGrid,
  HomePageCompanyLogo,
} from '@backstage/plugin-home';
import { HomePageSearchBar } from '@backstage/plugin-search';
import logo from '../../docs/SigilLogo.png';

function CustomizableHomePage() {
  const defaultConfig = [
    {
      component: <HomePageSearchBar />,
      x: 0,
      y: 1,
      width: 12,
      height: 1,
    },
    {
      component: <HomePageStarredEntities />,
      x: 0,
      y: 1,
      width: 6,
      height: 6,
    },
  ];

  return (
    <>
      <CustomHomepageGrid config={defaultConfig}>
        <HomePageCompanyLogo logo={<img src={logo} alt="logo" />} />
        <HomePageSearchBar />
        <HomePageStarredEntities />
      </CustomHomepageGrid>
    </>
  );
}

export default CustomizableHomePage;
