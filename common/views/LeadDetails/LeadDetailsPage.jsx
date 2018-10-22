import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import LeadDetails from './LeadDetails';
import * as LeadDetailsActions from './actions';

function mapStateToProps({ leadDetails, user, form }) {
  return {
    details: leadDetails.details,
    user,
    form
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...LeadDetailsActions, push }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadDetails);
