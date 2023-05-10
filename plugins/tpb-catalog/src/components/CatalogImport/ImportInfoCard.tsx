import { InfoCard, Link } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Typography } from '@material-ui/core';
import React from 'react';

export const ImportInfoCard = () => {
  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptional('app.title') || 'Backstage';

  return (
    <InfoCard
      title="Register an existing component"
      deepLink={{
        title: 'Learn more about the Software Catalog',
        link: 'https://docs.vmware.com/en/Tanzu-Application-Platform/1.0/tap/GUID-tap-gui-catalog-catalog-operations.html',
      }}
    >
      <Typography variant="body2" paragraph>
        Enter the URL to your source code repository to add it to {appTitle}.
      </Typography>
      <Typography variant="h6">Link to an existing entity file</Typography>
      <Typography variant="subtitle2" color="textSecondary" paragraph>
        To view example catalogs, visit {' '}
        <Link to="https://network.tanzu.vmware.com/products/tanzu-application-platform">
          Tanzu Network
        </Link>{' '}
        and navigate to the tap-gui-catalogs-latest folder. Here, you can view an example Blank Software Catalog that includes a catalog-info.yaml entity file.
      </Typography>
      <Typography variant="body2" paragraph>
        The wizard analyzes the file, previews the entities, and adds them to
        the {appTitle} catalog.
      </Typography>
    </InfoCard>
  );
};
