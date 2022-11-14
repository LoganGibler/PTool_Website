import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { Home } from "./components";

const App = () => {
  
  return (
    <Router>
      <div id="App">
        <Home />
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
