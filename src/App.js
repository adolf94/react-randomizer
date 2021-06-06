import logo from './logo.svg';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Randomizer from './mainApp';

function App() {
  return (
    <div className="App">
      <Router basename="/randomizer">
        <Switch>
          <Route path="/room/:roomId" component={Randomizer}>
            
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
