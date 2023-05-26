import React from 'react';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Navigate } from 'react-router';

export const DefaultRoute: React.FunctionComponent<any> = () => {
  const route =
    useApi(configApiRef).getOptionalString('customize.default_route') ??
    'catalog';
  return <Navigate key="/" to={route} replace />;
};
