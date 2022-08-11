import React from "react"
import ReactDOM from 'react-dom';
import { buildBackstageApp, loadSurfaces } from './AppBuilder'

export default () => {
  loadSurfaces()
    .then(surfaces => {
      const App = buildBackstageApp(surfaces)
      ReactDOM.render(<App />, document.getElementById('root'))
    })
}