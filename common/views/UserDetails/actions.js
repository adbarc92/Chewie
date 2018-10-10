import axios from 'axios';

export const GET_USER_DETAILS = 'GET_USER_DETAILS';
export const SAVE_USER_DETAILS = 'SAVE_USER_DETAILS';
export const SEND_COMMENT_TO_HUBSPOT = 'SEND_COMMENT_TO_HUBSPOT';

export function getUserDetails(id, token) {
  return {
    type: GET_USER_DETAILS,
    payload: axios({
      method: 'get',
      url: `/api/users/${id}`,
      headers: { Authorization: token }
    })
    .then(response => response.data)

  };
}

export function saveUserDetails(rawUserData, token) {
  // copy object and remove role before posting
  const data = Object.assign({}, rawUserData);
  delete data.isAdmin;
  delete data.id;

  return {
    type: SAVE_USER_DETAILS,
    payload: axios({
      method: 'patch',
      url: `/api/users/${rawUserData.id}`,
      data,
      headers: { Authorization: token }
    })
  };
}

export function sendCommentToHubSpot(email, comment, token) {
  const data = {
    email,
    comment
  };

  return {
    type: SEND_COMMENT_TO_HUBSPOT,
    payload: axios({
      method: 'post',
      url: '/api/users/sendCommentToHubSpot',
      data,
      headers: { Authorization: token }
    })
  };
}
