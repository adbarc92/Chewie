import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import * as NavbarActions from './actions';
import Navbar from './Navbar';

function mapStateToProps(store) {
  return {
    user: store.user,
    prep: store.prep
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...NavbarActions, push }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
