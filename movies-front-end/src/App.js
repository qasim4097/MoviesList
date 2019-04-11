import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import MoviesList from './components/movies-list.component';
import EditMovie from './components/edit-movie.component';
import AddMovie from './components/add-movie.component';
import Landing from "./components/landing.component";
import Register from "./components/register.component";
import Login from "./components/login.component";
import requireAuth from './components/require-auth.component';
import NoMatch from './components/no-match.component'; 
import Rating from './components/rate.component'
import Navbar from './components/navbar.component';

class App extends Component {
  
  render() {
    return (
      <Router>
        <div className=''>

          <Navbar/>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route path='/movies' exact component={requireAuth(MoviesList)}/>
            <Route path='/edit/:id' component={requireAuth(EditMovie)}/>
            <Route path='/add' component={requireAuth(AddMovie)}/>
            <Route path='/rate/:id' component={requireAuth(Rating)}/>
            <Route component={NoMatch} />
          </Switch>

        </div>
        
      </Router>
      );
  }
}

export default App;
