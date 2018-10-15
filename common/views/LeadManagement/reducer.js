export default function (state = { users: [], filteredUsers: null }, action = {}) {
  switch (action.type) {
    case 'GET_ALL_LEADS_FULFILLED':
      return { ...state, leads: action.payload.leads };
    case 'GET_ALL_LEADS_REJECTED':
      return state;
    case 'SEND_SMS_MESSAGE_FULFILLED':
      return { ...state, sent: action.payload.data };
    case 'SEND_SMS_MESSAGE_REJECTED':
      return state;
    default:
      return state;
  }
}
