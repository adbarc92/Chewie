import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import dashboard from './views/Dashboard/reducer';
import userManagement from './views/UserManagement/reducer';
import leadManagement from './views/LeadManagement/reducer';
import userDetails from './views/UserDetails/reducer';

const reducers = combineReducers({
  form: reduxFormReducer,
  user: (state = {}) => (state),
  account: (state = {}) => (state),
  routing: routerReducer,
  userManagement,
  leadManagement,
  dashboard,
  userDetails,
});

export default reducers;
