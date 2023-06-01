import React from 'react';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export interface ToggleFeatureProps {
  feature: string;
}

export const ToggleFeature: React.FunctionComponent<
  ToggleFeatureProps
> = props => {
  const config = useApi(configApiRef);
  const configVal = config.getOptionalBoolean(props.feature);
  const isFeatureEnabled = configVal ?? true;
  return isFeatureEnabled ? <>{props.children}</> : null;
};
