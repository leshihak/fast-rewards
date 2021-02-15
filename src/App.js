import React from "react";
import { Switch, Route, Redirect, Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import SignUpScreen from "./components/SignUpScreen";
import LogInScreen from "./components/LogInScreen";

const history = createBrowserHistory({
  basename: "/"
});

const App = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/">
          <Redirect to="/register" />
        </Route>
        <Route
          path="/register"
          exact
          component={SignUpScreen}
        />
        <Route
          path="/login"
          exact
          component={LogInScreen}
        />
      </Switch>
    </Router>
  );
}

export default App;
