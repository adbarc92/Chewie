export default function (state = { users: [], filteredUsers: null }, action = {}) {
  switch (action.type) {
    case 'GET_ALL_USERS_FULFILLED':
      return { ...state, users: action.payload.users };
    case 'GET_ALL_USERS_REJECTED':
      return state;
    case 'DELETE_USER_FULFILLED':
      return { ...state, deletedCount: action.payload };
    case 'DELETE_USER_REJECTED':
      return state;
    case 'FILTER_ALL_USERS':
      return { ...state, filteredUsers: action.payload.filteredUsers };
    default:
      return state;
  }
}
