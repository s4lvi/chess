import '../modules/styles.css'
import React from 'react'
import { Route } from 'react-router'
import App from './components/App'
import NoMatch from './components/NoMatch'

export default (
  <Route>
    <Route path="/" component={App}>
    </Route>
    <Route path="*" status={404} component={NoMatch}/>
  </Route>
)
