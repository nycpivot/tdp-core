import {
  Entity,
  DEFAULT_NAMESPACE,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import {
  Content,
  HeaderLabel,
  Link,
  Page,
  Progress,
  RoutedTabs,
  WarningPanel,
} from '@backstage/core-components';
import {
  attachComponentData,
  IconComponent,
  useElementFilter,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import {
  EntityRefLinks,
  entityRouteRef,
  FavoriteEntity,
  getEntityRelations,
  UnregisterEntityDialog,
  useAsyncEntity,
} from '@backstage/plugin-catalog-react';
import { Box, TabProps } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';
import { EntityContextMenu } from '../EntityContextMenu/EntityContextMenu';
import { PageHeader } from '../../PageHeader/PageHeader';

type SubRoute = {
  path: string;
  title: string;
  children: JSX.Element;
  if?: (entity: Entity) => boolean;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

const dataKey = 'plugin.catalog.entityLayoutRoute';

const Route: (props: SubRoute) => null = () => null;
attachComponentData(Route, dataKey, true);

// This causes all mount points that are discovered within this route to use the path of the route itself
attachComponentData(Route, 'core.gatherMountPoints', true);

const EntityLayoutTitle = ({
  entity,
  title,
}: {
  title: string;
  entity: Entity | undefined;
}) => {
  const to = `/catalog/${entity?.metadata.namespace ?? DEFAULT_NAMESPACE}/${
    entity?.kind
  }/${entity?.metadata.name}`;
  return (
    <Box display="inline-flex" alignItems="center" height="1em" maxWidth="100%">
      <Box
        component="span"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        overflow="hidden"
      >
        <Link to={to}>{title}</Link>
      </Box>
      {entity && <FavoriteEntity entity={entity} />}
    </Box>
  );
};

const headerProps = (
  paramKind: string | undefined,
  paramNamespace: string | undefined,
  paramName: string | undefined,
  entity: Entity | undefined,
): { headerTitle: string; headerType: ReactNode } => {
  const kind = paramKind ?? entity?.kind ?? '';
  const namespace = paramNamespace ?? entity?.metadata.namespace ?? '';
  const name =
    entity?.metadata.title ?? paramName ?? entity?.metadata.name ?? '';
  return {
    headerTitle: `${name}${
      namespace && namespace !== DEFAULT_NAMESPACE ? ` in ${namespace}` : ''
    }`,
    headerType: (() => {
      let t = kind.toLocaleLowerCase('en-US');
      if (entity && entity.spec && 'type' in entity.spec) {
        t += ' — ';
        t += (entity.spec as { type: string }).type.toLocaleLowerCase('en-US');
      }
      return <Link to="/catalog">{t}</Link>;
    })(),
  };
};

const EntityLabels = ({ entity }: { entity: Entity }) => {
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
  return (
    <>
      {ownedByRelations.length > 0 && (
        <HeaderLabel
          label="Owner"
          value={
            <EntityRefLinks
              entityRefs={ownedByRelations}
              defaultKind="Group"
              color="inherit"
            />
          }
        />
      )}
      {entity.spec?.lifecycle && (
        <HeaderLabel label="Lifecycle" value={entity.spec.lifecycle} />
      )}
    </>
  );
};

// NOTE(freben): Intentionally not exported at this point, since it's part of
// the unstable extra context menu items concept below
type ExtraContextMenuItem = {
  title: string;
  Icon: IconComponent;
  onClick: () => void;
};

// unstable context menu option, eg: disable the unregister entity menu
type contextMenuOptions = {
  disableUnregister: boolean;
};

type EntityLayoutProps = {
  UNSTABLE_extraContextMenuItems?: ExtraContextMenuItem[];
  UNSTABLE_contextMenuOptions?: contextMenuOptions;
  children?: React.ReactNode;
};

/**
 * EntityLayout is a compound component, which allows you to define a layout for
 * entities using a sub-navigation mechanism.
 *
 * Consists of two parts: EntityLayout and EntityLayout.Route
 *
 * @example
 * ```jsx
 * <EntityLayout>
 *   <EntityLayout.Route path="/example" title="Example tab">
 *     <div>This is rendered under /example/anything-here route</div>
 *   </EntityLayout.Route>
 * </EntityLayout>
 * ```
 */
export const EntityLayout = ({
  UNSTABLE_extraContextMenuItems,
  UNSTABLE_contextMenuOptions,
  children,
}: EntityLayoutProps) => {
  const { kind, namespace, name } = useRouteRefParams(entityRouteRef);
  const { entity, loading, error } = useAsyncEntity();
  const routes = useElementFilter(
    children,
    elements =>
      elements
        .selectByComponentData({
          key: dataKey,
          withStrictError:
            'Child of EntityLayout must be an EntityLayout.Route',
        })
        .getElements<SubRoute>() // all nodes, element data, maintain structure or not?
        .flatMap(({ props }) => {
          if (props.if && entity && !props.if(entity)) {
            return [];
          }

          return [
            {
              path: props.path,
              title: props.title,
              children: props.children,
              tabProps: props.tabProps,
            },
          ];
        }),
    [entity],
  );

  const { headerTitle, headerType } = headerProps(
    kind,
    namespace,
    name,
    entity,
  );

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const navigate = useNavigate();
  const cleanUpAfterRemoval = async () => {
    setConfirmationDialogOpen(false);
    navigate('/');
  };

  const showRemovalDialog = () => setConfirmationDialogOpen(true);
  return (
    <Page themeId={entity?.spec?.type?.toString() ?? 'home'}>
      <PageHeader
        title={<EntityLayoutTitle title={headerTitle} entity={entity!} />}
        pageTitleOverride={headerTitle}
        type={headerType}
      >
        {entity && (
          <>
            <EntityLabels entity={entity} />
            <EntityContextMenu
              UNSTABLE_extraContextMenuItems={UNSTABLE_extraContextMenuItems}
              UNSTABLE_contextMenuOptions={UNSTABLE_contextMenuOptions}
              onUnregisterEntity={showRemovalDialog}
              entityKind={kind}
            />
          </>
        )}
      </PageHeader>

      {loading && <Progress />}

      {entity && <RoutedTabs routes={routes} />}

      {error && (
        <Content>
          <Alert severity="error">{error.toString()}</Alert>
        </Content>
      )}

      {!loading && !error && !entity && (
        <Content>
          <WarningPanel title="Entity not found">
            There is no {kind} with the requested{' '}
            <Link to="https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/0.3/tap-0-3/GUID-tap-gui-catalog-catalog-operations.html">
              kind, namespace, and name
            </Link>
            .
          </WarningPanel>
        </Content>
      )}

      <UnregisterEntityDialog
        open={confirmationDialogOpen}
        entity={entity!}
        onConfirm={cleanUpAfterRemoval}
        onClose={() => setConfirmationDialogOpen(false)}
      />
    </Page>
  );
};

EntityLayout.Route = Route;
