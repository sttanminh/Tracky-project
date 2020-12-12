import React from 'react';
import { Router,Switch,Route } from "react-router-dom";
import { createBrowserHistory } from "history";

import { connect } from 'react-redux';
import { saveRouteHistory } from './redux/actions/AppAction';

import Home from "./pages/Home";
import Room from "./pages/Room";
import Test from "./pages/Test";
import './css/App.scss';

const customHistory = createBrowserHistory();

class App extends React.Component {
  componentDidMount(){
    this.props.saveRouteHistory(customHistory);
  }

  render(){
    return (
      <div className="App">
        <Router history={customHistory}> 
          <div>
            <Switch>
              <Route path="/room/:roomId">
                <Room></Room>
              </Route>
              <Route path="/test">
                <Test></Test>
              </Route>
              <Route exact path="/">
                <Home></Home>
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => {
	return {
		saveRouteHistory : (history) => {
			dispatch(saveRouteHistory(history));
    }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
