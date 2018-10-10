import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import UserDetails from './UserDetails';
import * as UserDetailsActions from './actions';

function mapStateToProps({ userDetails, user, form }) {
  return {
    details: userDetails.details,
    user,
    form
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...UserDetailsActions, push }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
