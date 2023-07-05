import React from 'react';
import {
  HomePageStarredEntities,
  CustomHomepageGrid,
} from '@backstage/plugin-home';

function CustomizableHomePage() {
  return (
    <CustomHomepageGrid>
      <h1>Hello, World</h1>
      <HomePageStarredEntities />
    </CustomHomepageGrid>
  );
}

export default CustomizableHomePage;
