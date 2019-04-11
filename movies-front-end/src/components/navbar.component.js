import React, { Component } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

class Navbar extends Component {
    
  logout(){
    localStorage.removeItem('jwtToken')
  }
  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <ul className="right hide-on-med-and-down">
            <li><Link to="/movies" >Dashboard</Link></li>
            <li><Link to="/add">Add Movies</Link></li>
            <li><Link to="/" onClick={() => this.logout()}>Logout</Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}
export default Navbar;