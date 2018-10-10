import React, { Component } from 'react';
import cookie from 'react-cookie';
import PropTypes from 'prop-types';

export default class Dashboard extends Component {
  componentWillMount() {
    const { user } = this.props;
    if (user) cookie.save('x-account-id', user.accountId, { path: '/' });
  }

  render() {
    const mockProfile = { profile: { displayName: 'none' } };
    const { profile } = this.props.user.profiles[0] || mockProfile;
    const { user } = this.props;
    return (
      <div>
        <h1>Dashboard</h1>

        Loading...

        {user.isAdmin && <div>
          <h2>Current profile is: {profile.displayName} </h2>
          <h2>Current user is: {user.username} </h2>
        </div>}

      </div>
    );
  }
}

Dashboard.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.object,
  ])
};
