import React from "react";
import { Route, Switch } from "react-router-dom";
import { MainPage, LoginPage } from "@pages";

const App = () => {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={MainPage} />
    </Switch>
  );
};

export default App;
