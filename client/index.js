import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Main, StartPage, GameOver } from "./components";
import "./socket";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/gameOver" component={GameOver} />
        <Route path="/game" component={Main} />
        <Route path="/" component={StartPage} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("app")
);
