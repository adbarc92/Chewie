import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Navbar extends Component {
  render() {
    const { user } = this.props;

    let items = null;
    if (user.isAdmin) {
      items = (<ul className="nav navbar-nav navbar-right">
        <li><a href="/auth/account#/">Dashboard</a></li>
        <li><a rel="noopener noreferrer" target="_blank" href="/explorer">Explorer</a></li>
        <li className="dropdown">
          <a className="dropbtn">DropItLikeItsHot</a>
          <div className="dropdown-content">
            <a href="#">test</a>
            <a href="#">test</a>
            <a href="#">test</a>
          </div>
        </li>
        <li><a href="/auth/account#/users">Users</a></li>
        <li><a href="/auth/account#/account">My Account</a></li>
        <li><a href="/auth/logout">Log Out</a></li>
      </ul>);
    } else {
      items = (<ul className="nav navbar-nav navbar-right">
        <li><a href="/auth/account#/account">My Account</a></li>
        <li><a href="/auth/logout">Log Out</a></li>
      </ul>);
    }
    return (
      <nav role="navigation" className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" className="navbar-toggle collapsed">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span></button>
              <a href="/" className="navbar-brand">{user.brand.companyName}</a>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            {items}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.object
  ])
};
