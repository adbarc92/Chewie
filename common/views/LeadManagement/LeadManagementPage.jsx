import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import LeadManagement from './LeadManagement';
import * as LeadManagementActions from './actions';

function mapStateToProps({ leadManagement, user, account }) {
  return {
    leads: leadManagement.leads,
    user,
    account
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...LeadManagementActions, push }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadManagement);
