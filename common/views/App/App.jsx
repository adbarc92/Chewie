import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import AccountPage from '../Account/Account';
import DashboardPage from '../Dashboard/DashboardPage';
import LoginFormPage from '../Login/Login';
import Navbar from '../Navbar/NavbarPage';
import UserDetailsPage from '../UserDetails/UserDetailsPage';
import UserManagementPage from '../UserManagement/UserManagementPage';
import LeadManagementPage from '../LeadManagement/LeadManagementPage';


class App extends Component {
  handleLogout() {
    const { user } = this.props;
    this.props.dispatch(logout(user));
  }

  render() {
    const { user } = this.props;
    return (
      <Router>
        <div>
          <div className="container">
            <div className="app-content">
              { user.username !== 'Jeeves' && <Navbar /> }
              <Switch>
                <Route exact path="/" component={DashboardPage} />
                <Route path="/local" component={LoginFormPage} />
                <Route path="/account" component={AccountPage} />
                <Route path="/users" component={UserManagementPage} />
                <Route path="/leads" component={LeadManagementPage} />
                <Route path="/user/:id" component={UserDetailsPage} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

App.contextTypes = {
  store: PropTypes.object.isRequired
};

function mapStateToProps(store) {
  return {
    user: store.user
  };
}

export default connect(mapStateToProps)(App);
