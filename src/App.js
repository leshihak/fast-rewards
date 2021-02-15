import React from "react";
import { Switch, Route, Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import SignUpScreen from "./components/SignUpScreen";
import AuthProvider from "./components/AuthProvider";
import LogInScreen from "./components/LogInScreen";
import HomePage from "./components/HomePage";
import PrivateRoute from "./components/PrivateRoute";

const history = createBrowserHistory({
  basename: "/",
});

const App = () => {
  return (
    <AuthProvider>
      <Router history={history}>
        <Switch>
          <Route path="/register" exact component={SignUpScreen} />
          <Route path="/login" exact component={LogInScreen} />
          <PrivateRoute path="/" component={HomePage} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
