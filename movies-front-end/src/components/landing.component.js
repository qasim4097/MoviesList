import React, { Component } from "react";

class Landing extends Component {
 
  render() {
    return (
      <div style={{ height: "75vh", marginTop: "10px"}} className="container">
        <div className="row">
          <div className="col-lg-12 center-align">
            <a
            href = '/register'
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px"
              }}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Register
            </a>
            <a
                href = '/login'
              style={{
                marginLeft: "2rem",
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px"
              }}
              className="btn btn-large waves-effect white hoverable black-text"
            >
              Log In
            </a>
          </div>
        </div>
      </div>
    );
  }
}
export default Landing;