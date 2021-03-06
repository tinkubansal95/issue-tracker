import React from "react";
import Auth from "../../utils/auth";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function Navtabs() {
  function showNavigation() {
    if (Auth.loggedIn()) {
      return (
        <li className="nav-item">
          <NavLink
            to="/logout"
            activeClassName="active"
            onClick={() => Auth.logout()}
          >
            Logout
          </NavLink>
        </li>
      );
    } else {
      return (
        <li className="nav-item">
          <NavLink to="/login" activeClassName="active">
            Login/SignUp
          </NavLink>
        </li>
      );
    }
  }

  return (
    <header>
      <h1>
        <Link to="/dashboard">
          <span role="img" aria-label="shopping bag">
            <img src={logo} alt="Issue Tracker" />
          </span>
        </Link>
      </h1>
      <nav className="nav nav-pills nav-justified">
        <ul className="nav nav-pills">
          <li className="nav-item ">
            <NavLink to="/dashboard" activeClassName="active">
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/addIssue" activeClassName="active">
              LodgeIssue
            </NavLink>
          </li>
          {showNavigation()}
        </ul>
      </nav>
    </header>
  );
}

export default Navtabs;
