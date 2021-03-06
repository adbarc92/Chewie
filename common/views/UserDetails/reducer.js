export default function (state = { details: {} }, action = {}) {
  switch (action.type) {
    case 'GET_USER_DETAILS_FULFILLED':
      return { ...state, details: action.payload };
    case 'GET_USER_DETAILS_REJECTED':
      return { ...state, error: action.payload };
    case 'SAVE_USER_DETAILS_FULFILLED':
      return { ...state, saved: action.payload };
    case 'SAVE_USER_DETAILS_REJECTED':
      return { ...state, error: action.payload };
    case 'SEND_COMMENT_TO_HUBSPOT_FULFILLED':
      return { ...state, hubspotCommentSent: action.payload };
    case 'SEND_COMMENT_TO_HUBSPOT_REJECTED':
      return { ...state, error: action.payload }
    default:
      return state;
  }
}
