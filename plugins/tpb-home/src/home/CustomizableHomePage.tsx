import React from 'react';
import { HomeSurface } from '../HomeSurface';
import HomePage from './HomePage';

function customizableHomePage(surface: HomeSurface) {
  return <HomePage surface={surface} />;
}

export default customizableHomePage;
