const axios = require('axios');
const winston = require('winston');
require('winston-loggly-bulk');

const app = require('../../server');

if (process.env.NODE_ENV === 'development') {
  require('../../../credentials.js');
}

const hapikey = process.env.HUBSPOT_API;

const sendMessageToHubSpot = (args) => {
  const { message, hubSpotId } = args;
  const url = `https://api.hubapi.com/engagements/v1/engagements?hapikey=${hapikey}`;

  const note = `<h1>SMS MESSAGE</h1><p><b>Body: </b>${message.body}</p><p><b>Direction: </b>${message.direction}</p><p><a href="https://www.twilio.com/console/sms/logs/${message.sid}" target="_blank">${message.sid}</a><p>`;

  const data2post = {
    engagement: {
      active: true,
      type: 'NOTE'
    },
    associations: {
      contactIds: [hubSpotId]
    },
    metadata: {
      body: note
    }
  };
  console.log(url, data2post);
  return axios.post(url, data2post)
    .then(response => response.data);
};

const handleInboundMessageToHubSpot = (message) => {
  const { Lead } = app.models;
  // TODO: handle message.hubSpotId == undefined
  Lead.findOne({ where: { id: message.leadId } })
    .then((lead) => {
      const finalMessage = {
        body: message.tx,
        direction: 'inbound',
        sid: '#'
      };
      return sendMessageToHubSpot({ message: finalMessage, hubSpotId: lead.hs });
    });
};

module.exports = {
  sendMessageToHubSpot,
  handleInboundMessageToHubSpot
};
