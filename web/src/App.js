import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Landing from './Pages/Landing';
import Auth from './Pages/Auth';

const App = () => {
  return (
      <>
      <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Landing}></Route>
          <Route path="/login" component={Auth}></Route>
        </Switch>
      </div>
      </Router>
      </>
  );
}

export default App;
