import React from 'react';
import {AppPluginInterface, AppRouteSurface, SurfaceStoreInterface} from "@tpb/core-frontend";
import {EntityPageSurface} from "@tpb/plugin-catalog";
import {EntitySnykContent, isSnykAvailable, SnykOverview} from "backstage-plugin-snyk";
import {EntityLayout, EntitySwitch} from "@backstage/plugin-catalog";
import {Grid} from "@material-ui/core";

export const SnykPlugin: AppPluginInterface
    = () => (context: SurfaceStoreInterface) => {
    context.applyWithDependency(
        AppRouteSurface,
        EntityPageSurface,
        (_appRouteSurface, entityPageSurface) => {
            entityPageSurface.addOverviewContent(
                <EntitySwitch>
                    <EntitySwitch.Case if={isSnykAvailable}>
                        <Grid item md={3}>
                            <SnykOverview/>
                        </Grid>
                    </EntitySwitch.Case>
                </EntitySwitch>
            )
            entityPageSurface.servicePage.addTab(
                <EntityLayout.Route path="/snyk" title="Security">
                    <EntitySnykContent/>
                </EntityLayout.Route>
            )
        }
    )
}
