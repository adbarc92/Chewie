import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import UserManagement from './UserManagement';
import * as UserManagementActions from './actions';

function mapStateToProps({ userManagement, user }) {
  return {
    users: userManagement.users,
    filteredUsers: userManagement.filteredUsers,
    user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...UserManagementActions, push }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
