import React, { Component } from 'react';
import { connect } from 'react-redux';

class Account extends Component {
  render() {
    const { profile } = this.props.user.profiles[0] || { profile: { displayName: 'none ' } };
    const { user } = this.props;
    console.log(profile);
    return (
      <div className="container">
        <h1>Account</h1>
        <h2>Current profile is: {profile.displayName} </h2>
        <h2>Current user is: {user.username} </h2>

        {user.isAdmin && <h3>and USER is ADMIN</h3>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(Account);
