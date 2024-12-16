// Global DOM components.
import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'

// The App.
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import history from 'utils/history'

// Redux.
import { Provider } from 'react-redux'
import store from './store'

// Localization
import './i18n'

// Global CSS.
import './tailwind.css'
import './index.css'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)

// registerServiceWorker()
