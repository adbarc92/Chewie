import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Dashboard from './Dashboard';
import * as DashboardActions from './actions';

function mapStateToProps({ dashboard, user }) {
  return {
    user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...DashboardActions, push }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
