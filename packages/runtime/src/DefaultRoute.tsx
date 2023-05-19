import React from 'react';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Navigate } from 'react-router';
// import { AppRouteSurface } from '@tpb/core';

export const DefaultRoute: React.FunctionComponent<any> = (
  // routeSurface: AppRouteSurface,
) => {
  const route = useApi(configApiRef).getOptionalString('customize.default_route') ??
    'catalog';
  // routeSurface.setDefault(route);
  return <Navigate key="/" to={route} replace={true} />;
};
