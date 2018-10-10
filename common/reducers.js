import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import dashboard from './views/Dashboard/reducer';
import userManagement from './views/UserManagement/reducer';
import userDetails from './views/UserDetails/reducer';

const reducers = combineReducers({
  form: reduxFormReducer,
  user: (state = {}) => (state),
  routing: routerReducer,
  userManagement,
  dashboard,
  userDetails,
});

export default reducers;
