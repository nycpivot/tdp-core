import React from 'react';
import { Route } from "react-router";
import {AppPluginInterface, AppRouteSurface, SidebarItemSurface} from "@tpb/core";
import {SidebarItem} from "@backstage/core-components";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import {SupplyChainPage} from "@tint/plugin-supply-chain";

export const SupplyChainPlugin: AppPluginInterface = () => context => {
    context.applyTo(AppRouteSurface, routes => {
            routes.add(<Route path='/supply-chain' element={<SupplyChainPage/>}/>);
        }
    );
    context.applyTo(SidebarItemSurface, sidebar =>
        sidebar.addMainItem(
            <SidebarItem icon={AccountTreeIcon} to='supply-chain' text='Supply Chain' />,
        ),
    );
}
