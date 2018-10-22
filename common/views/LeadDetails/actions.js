import axios from 'axios';

export const GET_LEAD_DETAILS = 'GET_LEAD_DETAILS';
export const SAVE_LEAD_DETAILS = 'SAVE_LEAD_DETAILS';
export const SEND_COMMENT_TO_HUBSPOT = 'SEND_COMMENT_TO_HUBSPOT';

export function getLeadDetails(id, token) {
  return {
    type: GET_LEAD_DETAILS,
    payload: axios({
      method: 'get',
      url: `/api/Leads/${id}`,
      headers: { Authorization: token }
    })
    .then(response => response.data)

  };
}

export function saveLeadDetails(data, token) {
  return {
    type: SAVE_LEAD_DETAILS,
    payload: axios({
      method: 'patch',
      url: `/api/Leads/${data.id}`,
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
      url: '/api/Proxies/sendCommentToHubSpot',
      data,
      headers: { Authorization: token }
    })
  };
}
