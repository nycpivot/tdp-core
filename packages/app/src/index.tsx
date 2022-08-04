import '@backstage/cli/asset-types';
import React from 'react';
import ReactDOM from 'react-dom';

import { AppBuilder, AppSurfaces } from '@internal/plugin-app-builder';

const loadSurfaces = async (): Promise<AppSurfaces> => {
    const surfaces: AppSurfaces = new AppSurfaces()
    surfaces.routeSurface.setDefault("catalog")

    const catalogPlugin = await import('@internal/plugin-esback-catalog')
    catalogPlugin.ESBackPluginIntegration(surfaces)

    const graphiQLPlugin = await import('@internal/plugin-esback-graphiql')
    graphiQLPlugin.ESBackPluginIntegration(surfaces)

    return surfaces
} 

loadSurfaces()
    .then(surfaces => {
        const App = AppBuilder(surfaces)
        ReactDOM.render(<App />, document.getElementById('root'))
    })
