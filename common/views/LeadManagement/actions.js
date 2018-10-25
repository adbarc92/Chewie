import axios from 'axios';

export const GET_ALL_LEADS = 'GET_ALL_LEADS';
export const SEND_SMS_MESSAGE = 'SEND_SMS_MESSAGE';

const formatData = filteredLeads =>
  filteredLeads.sort((a, b) => {
    const keyA = (_.get(a, 'fn', 'Zz Zz').toUpperCase());
    const keyB = (_.get(b, 'fn', 'Zz Zz').toUpperCase());
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

export function getAllLeads(token, aId) {
  return {
    type: GET_ALL_LEADS,
    payload: axios({
      method: 'get',
      url: `/api/Accounts/${aId}/leads?filter[include]=messages`,
      headers: { Authorization: token }
    })
    // .then(response => ({ leads: formatData(response.data) }))
    .then(response => ({ leads: response.data }))
  };
}

export function sendSMSMessage(token, message, lead, aId) {
  const urlBase = '/api/Proxies/sendLeadSMSMessage?';
  const urlParams = `body=${message}&to=${lead.ph}&from=18588159018&leadId=${lead.id}&aId=${aId}`;
  return {
    type: SEND_SMS_MESSAGE,
    payload: axios({
      method: 'get',
      url: `${urlBase}${urlParams}`,
      headers: { Authorization: token }
    })
  };
}
