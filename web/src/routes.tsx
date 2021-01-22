import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import PageMap from './pages/PageMap'
import Area from './pages/Area'
import CreateArea from './pages/CreateArea'
import Login from './pages/Login'
import Register from './pages/Register'
import Update from './pages/Update'

function Routes () {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/app" component={PageMap} />
                <Route path="/area/create" component={CreateArea} />
                <Route path="/area/:id" component={Area} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/update/:id" component={Update} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;