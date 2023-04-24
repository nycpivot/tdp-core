import React from 'react';
import { Grid } from '@material-ui/core';
import {
  EntityAboutCard,
  EntityDependsOnComponentsCard,
  EntityDependsOnResourcesCard,
  EntityHasComponentsCard,
  EntityHasResourcesCard,
  EntityHasSubcomponentsCard,
  EntityHasSystemsCard,
  EntityLayout,
  EntityLinksCard,
  EntitySwitch,
  EntityOrphanWarning,
  EntityProcessingErrorsPanel,
  isComponentType,
  isKind,
  hasCatalogProcessingErrors,
  isOrphan,
} from '@backstage/plugin-catalog';
import {
  EntityUserProfileCard,
  EntityGroupProfileCard,
  EntityMembersListCard,
  EntityOwnershipCard,
} from '@backstage/plugin-org';
import {
  Direction,
  EntityCatalogGraphCard,
} from '@backstage/plugin-catalog-graph';
import {
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CONSUMES_API,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_PART,
  RELATION_PART_OF,
  RELATION_PROVIDES_API,
} from '@backstage/catalog-model';
import { EntityPageSurface } from '../EntityPageSurface';
import {
  EntityApiDefinitionCard,
  EntityConsumedApisCard,
  EntityConsumingComponentsCard,
  EntityProvidedApisCard,
  EntityProvidingComponentsCard,
} from '@backstage/plugin-api-docs';

export const entityPage = (surface: EntityPageSurface) => {
  /**
   * Note: do NOT extract the following constants in React functional components:
   * that will break the plugins auto-discovery implemented in Backstage.
   *
   * Here is the kind of error you might have if you try to refactor
   * this code with React components: https://github.com/backstage/backstage/issues/13307
   */

  const entityWarningContent = (
    <>
      <EntitySwitch>
        <EntitySwitch.Case if={isOrphan}>
          <Grid item xs={12}>
            <EntityOrphanWarning />
          </Grid>
        </EntitySwitch.Case>
      </EntitySwitch>

      <EntitySwitch>
        <EntitySwitch.Case if={hasCatalogProcessingErrors}>
          <Grid item xs={12}>
            <EntityProcessingErrorsPanel />
          </Grid>
        </EntitySwitch.Case>
      </EntitySwitch>
    </>
  );

  const overviewContent = (
    <Grid container spacing={3} alignItems="stretch">
      {entityWarningContent}
      <Grid item md={6}>
        <EntityAboutCard variant="gridItem" />
      </Grid>
      <Grid item md={6} xs={12}>
        <EntityCatalogGraphCard variant="gridItem" height={400} />
      </Grid>

      <Grid item md={4} xs={12}>
        <EntityLinksCard />
      </Grid>
      <Grid item md={8} xs={12}>
        <EntityHasSubcomponentsCard variant="gridItem" />
      </Grid>
      {surface.overviewContent}
    </Grid>
  );

  const serviceEntityPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title="Overview">
        {overviewContent}
      </EntityLayout.Route>

      <EntityLayout.Route path="/api" title="API">
        <Grid container spacing={3} alignItems="stretch">
          <Grid item md={6}>
            <EntityProvidedApisCard />
          </Grid>
          <Grid item md={6}>
            <EntityConsumedApisCard />
          </Grid>
        </Grid>
      </EntityLayout.Route>

      <EntityLayout.Route path="/dependencies" title="Dependencies">
        <Grid container spacing={3} alignItems="stretch">
          <Grid item md={6}>
            <EntityDependsOnComponentsCard variant="gridItem" />
          </Grid>
          <Grid item md={6}>
            <EntityDependsOnResourcesCard variant="gridItem" />
          </Grid>
        </Grid>
      </EntityLayout.Route>

      {surface.servicePage.tabs}
    </EntityLayout>
  );

  const websiteEntityPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title="Overview">
        {overviewContent}
      </EntityLayout.Route>

      <EntityLayout.Route path="/dependencies" title="Dependencies">
        <Grid container spacing={3} alignItems="stretch">
          <Grid item md={6}>
            <EntityDependsOnComponentsCard variant="gridItem" />
          </Grid>
          <Grid item md={6}>
            <EntityDependsOnResourcesCard variant="gridItem" />
          </Grid>
        </Grid>
      </EntityLayout.Route>

      {surface.websitePage.tabs}
    </EntityLayout>
  );

  /**
   * NOTE: This page is designed to work on small screens such as mobile devices.
   * This is based on Material UI Grid. If breakpoints are used, each grid item must set the `xs` prop to a column size or to `true`,
   * since this does not default. If no breakpoints are used, the items will equitably share the available space.
   * https://material-ui.com/components/grid/#basic-grid.
   */

  const defaultEntityPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title="Overview">
        {overviewContent}
      </EntityLayout.Route>

      {surface.defaultPage.tabs}
    </EntityLayout>
  );

  const componentPage = (
    <EntitySwitch>
      <EntitySwitch.Case if={isComponentType('service')}>
        {serviceEntityPage}
      </EntitySwitch.Case>

      <EntitySwitch.Case if={isComponentType('website')}>
        {websiteEntityPage}
      </EntitySwitch.Case>

      {surface.componentPageCases}

      <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
    </EntitySwitch>
  );

  const ApiPage = () => (
    <EntityLayout>
      <EntityLayout.Route path="/" title="Overview">
        <Grid container direction="row" spacing={3}>
          {entityWarningContent}
          <Grid container item>
            <Grid item md={6} xs={12}>
              <EntityAboutCard variant="fullHeight" />
            </Grid>
            <Grid container item md={6} xs={12}>
              <Grid item md={12} xs={12}>
                <EntityLinksCard />
              </Grid>
            </Grid>
            {surface.apiPage.overviewContents}
          </Grid>
          <Grid item md={6} xs={12}>
            <EntityProvidingComponentsCard />
          </Grid>
          <Grid item md={6} xs={12}>
            <EntityConsumingComponentsCard />
          </Grid>
        </Grid>
      </EntityLayout.Route>

      <EntityLayout.Route path="/definition" title="Definition">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <EntityApiDefinitionCard />
          </Grid>
        </Grid>
      </EntityLayout.Route>

      {surface.apiPage.tabs}
    </EntityLayout>
  );

  const userPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title="Overview">
        <Grid container spacing={3}>
          {entityWarningContent}
          <Grid item xs={12} md={6}>
            <EntityUserProfileCard variant="gridItem" />
          </Grid>
          <Grid item xs={12} md={6}>
            <EntityOwnershipCard variant="gridItem" />
          </Grid>
        </Grid>
      </EntityLayout.Route>
      {surface.userPage.tabs}
    </EntityLayout>
  );

  const groupPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title="Overview">
        <Grid container spacing={3}>
          {entityWarningContent}
          <Grid item xs={12} md={6}>
            <EntityGroupProfileCard variant="gridItem" />
          </Grid>
          <Grid item xs={12} md={6}>
            <EntityOwnershipCard variant="gridItem" />
          </Grid>
          <Grid item xs={12}>
            <EntityMembersListCard />
          </Grid>
        </Grid>
      </EntityLayout.Route>
      {surface.groupPage.tabs}
    </EntityLayout>
  );

  const systemPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title="Overview">
        <Grid container spacing={3} alignItems="stretch">
          {entityWarningContent}
          <Grid item md={6}>
            <EntityAboutCard variant="gridItem" />
          </Grid>
          <Grid item md={6} xs={12}>
            <EntityCatalogGraphCard variant="gridItem" height={400} />
          </Grid>
          <Grid item md={6}>
            <EntityHasComponentsCard variant="gridItem" />
          </Grid>
          <Grid item md={6}>
            <EntityHasResourcesCard variant="gridItem" />
          </Grid>
        </Grid>
      </EntityLayout.Route>
      <EntityLayout.Route path="/diagram" title="Diagram">
        <EntityCatalogGraphCard
          variant="gridItem"
          direction={Direction.TOP_BOTTOM}
          title="System Diagram"
          height={700}
          relations={[
            RELATION_PART_OF,
            RELATION_HAS_PART,
            RELATION_API_CONSUMED_BY,
            RELATION_API_PROVIDED_BY,
            RELATION_CONSUMES_API,
            RELATION_PROVIDES_API,
            RELATION_DEPENDENCY_OF,
            RELATION_DEPENDS_ON,
          ]}
          unidirectional={false}
        />
      </EntityLayout.Route>
      {surface.systemPage.tabs}
    </EntityLayout>
  );

  const domainPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title="Overview">
        <Grid container spacing={3} alignItems="stretch">
          {entityWarningContent}
          <Grid item md={6}>
            <EntityAboutCard variant="gridItem" />
          </Grid>
          <Grid item md={6} xs={12}>
            <EntityCatalogGraphCard variant="gridItem" height={400} />
          </Grid>
          <Grid item md={6}>
            <EntityHasSystemsCard variant="gridItem" />
          </Grid>
        </Grid>
      </EntityLayout.Route>
      {surface.domainPage.tabs}
    </EntityLayout>
  );

  return (
    <EntitySwitch>
      <EntitySwitch.Case if={isKind('component')} children={componentPage} />
      <EntitySwitch.Case if={isKind('api')} children={<ApiPage />} />
      <EntitySwitch.Case if={isKind('group')} children={groupPage} />
      <EntitySwitch.Case if={isKind('user')} children={userPage} />
      <EntitySwitch.Case if={isKind('system')} children={systemPage} />
      <EntitySwitch.Case if={isKind('domain')} children={domainPage} />

      <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
    </EntitySwitch>
  );
};
