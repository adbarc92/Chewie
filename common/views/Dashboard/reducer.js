export default function (state = { userCount: 0 }, action = {}) {
  switch (action.type) {
    case 'GET_USER_COUNT_FULFILLED':
      return { ...state, userCount: action.payload };
    case 'GET_USER_COUNT_REJECTED':
      return state;
    default:
      return state;
  }
}
