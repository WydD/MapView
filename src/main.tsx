import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import App from './components/App'
import { state } from './state/state'
import 'modern-normalize'
import '@accurat/tachyons-lite'
import 'tachyons-extra'
import 'style.css'
import 'panels.css'
import 'color-palette.css'
import 'infobox.css'
import 'geocoder-override.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import './lib/modernizr-custom-3.6.0'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

function renderApp() {
  ReactDOM.render(
    <div className="w-100 h-100">
      <Provider globalState={state}>
        <App />
      </Provider>
    </div>,
    document.getElementById('root'),
  )
}

renderApp()
