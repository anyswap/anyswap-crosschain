import React, { Suspense, lazy } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import config from '../../config'

import Farms from './FarmsList'
import MATICfarming from './MATICfarming'

export default function Farm() {
  return (
    <>
      <Suspense fallback={null}>
        <Switch>
          <Route exact strict path="/farms" component={() => <Farms />} />
          <Route exact strict path={config.farmUrl + "fsnfarming"} component={() => <MATICfarming />} />
          <Route
            path={config.farmUrl + "maticfarming/:lpToken"}
            render={({ match }) => {
              return <MATICfarming initialTrade={match.params.lpToken} />
            }}
          />

          <Redirect to="/farms" />
        </Switch>
      </Suspense>
    </>
  )
}
