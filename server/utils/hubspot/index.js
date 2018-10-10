const axios = require('axios');
const _ = require('lodash');
const winston = require('winston');
require('winston-loggly-bulk');

if (process.env.NODE_ENV === 'development') {
  require('../../../credentials.js');
}

const apikey = process.env.HUBSPOT_API;

const getWakatimeByEmail = email =>
  axios.get(`https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${apikey}`)
    .then(result => _.get(result, 'data.properties.wakatime_api_key.value', null))
    .catch(err => err);

const getUserByEmail = email =>
  axios.get(`https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${apikey}`)
    .then(result => result)
    .catch(err => err);

const sendCommentToHubSpot = (args) => {
  const { email, comment } = args;

  return new Promise(async (resolve, reject) => {
    try {
      let url = `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${apikey}`;
      const { data } = await axios.get(url);
      const vid = data.vid;

      // We got the user id (vid), now post the comment
      // i.e. attach a note to the contact.
      url = `https://api.hubapi.com/engagements/v1/engagements?hapikey=${apikey}`;

      const data2post = {
        engagement: {
          active: true,
          type: 'NOTE'
        },
        associations: {
          contactIds: [vid],
        },
        metadata: {
          body: comment
        }
      };

      await axios.post(url, data2post);
      resolve('OK');
    } catch (err) {
      reject(err.message);
    }
  });
};

const sendContactToHubspot = (firstname, lastname, email, phone) => {
  winston.log('info', 'new hubspot contact', { firstname, lastname, email, phone });
  return axios({
    method: 'post',
    url: `https://forms.hsforms.com/uploads/form/v2/${process.env.HUBSPOT_ID}/${process.env.HUBSPOT_FORM_COURSE_SIGNUP}?firstname=${firstname}&lastname=${lastname}&email=${email}&phone=${phone}&actual_lead_source=Prep+Course+Flow`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
    .then(response => response)
    .catch(err => err);
};

const sendCourseCompletionToHubspot = (email, coursesCompleted) => {
  winston.log('info', 'course complete', { email, coursesCompleted });
  return axios({
    method: 'post',
    url: `https://forms.hubspot.com/uploads/form/v2/${process.env.HUBSPOT_ID}/${process.env.HUBSPOT_FORM_COURSE_COMPLETED}?email=${email}&coursescompleted=${coursesCompleted}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
    .then(response => response)
    .catch(err => err);
};

module.exports = {
  getWakatimeByEmail,
  getUserByEmail,
  sendContactToHubspot,
  sendCourseCompletionToHubspot,
  sendCommentToHubSpot
};
