import React from 'react';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Route, RouteProps } from 'react-router';

export interface ToggleRouteProps extends RouteProps {
  feature: string;
}

export const ToggleRoute: React.FunctionComponent<ToggleRouteProps> = ({
  feature,
  ...props
}) => {
  const config = useApi(configApiRef);
  const isFeatureEnabled =
    config.getOptionalBoolean(`customize.features.${feature}`) ?? true;
  return <>{isFeatureEnabled && <Route {...props} />}</>;
};
