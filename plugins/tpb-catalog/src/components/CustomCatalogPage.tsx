import type { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { CatalogFilterLayout } from '@backstage/plugin-catalog-react';
import {
  Content,
  ContentHeader,
  CreateButton,
  PageWithHeader,
  SupportButton,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  EntityLifecyclePicker,
  EntityListProvider,
  EntityOwnerPicker,
  EntityTagPicker,
  EntityTypePicker,
  UserListFilterKind,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import React from 'react';
import {
  CatalogKindHeader,
  CatalogTable,
  FilteredEntityLayout,
  EntityListContainer,
  FilterContainer,
  catalogPlugin,
} from '@backstage/plugin-catalog';

export type EntityRow = {
  entity: Entity;
  resolved: {
    name: string;
    partOfSystemRelationTitle?: string;
    partOfSystemRelations: CompoundEntityRef[];
    ownedByRelationsTitle?: string;
    ownedByRelations: CompoundEntityRef[];
  };
};

type CatalogPageProps = {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<EntityRow>[];
  actions?: TableProps<EntityRow>['actions'];
};

export const CustomCatalogPage = ({
  columns,
  actions,
  initiallySelectedFilter = 'owned',
}: CatalogPageProps) => {
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';
  const createComponentLink = useRouteRef(
    catalogPlugin.externalRoutes.createComponent,
  );

  return (
    <PageWithHeader title={`${orgName} Catalog`} themeId="home">
      <EntityListProvider>
        <Content>
          <ContentHeader titleComponent={<CatalogKindHeader />}>
            <CreateButton
              title="Register Entity"
              to={createComponentLink && createComponentLink()}
            />
            <SupportButton>All your software catalog entities</SupportButton>
          </ContentHeader>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <EntityTypePicker />
              <UserListPicker initialFilter={initiallySelectedFilter} />
              <EntityOwnerPicker />
              <EntityLifecyclePicker />
              <EntityTagPicker />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <CatalogTable columns={columns} actions={actions} />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </Content>
      </EntityListProvider>
    </PageWithHeader>
  );
};
