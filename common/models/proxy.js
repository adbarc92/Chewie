module.exports = (Proxy) => {
  const client = require('twilio')(process.env.SMS_ACCOUNT_SID, process.env.SMS_AUTH_TOKEN);
  const { sendMessageToHubSpot, handleInboundMessageToHubSpot } = require('../../server/utils/hubspot');

  Proxy.sendTestSMS = (body, to, from, cb) => {
    client.messages
      .create({ body, to, from })
      .then(response => cb(null, response))
      .done();
  };

  Proxy.remoteMethod('sendTestSMS', {
    description: [
      'Send a test message via Twilio API to the admin user by default.',
    ],
    http: { path: '/sendTestSMS', verb: 'get' },
    accepts: [
      { arg: 'body', type: 'string', default: 'Hi, this is a test message.' },
      { arg: 'to', type: 'string', default: process.env.ADMIN_MOBILE },
      { arg: 'from', type: 'string', default: process.env.PHONE_1 },
    ],
    returns: [
      { arg: 'data', type: 'string' },
    ]
  });

  Proxy.sendSMSMessage = (body, to, from, cb) => {
    client.messages
      .create({ body, to, from })
      .then(response => cb(null, response))
      .done();
  };

  Proxy.remoteMethod('sendSMSMessage', {
    description: [
      'Send a message (does not store message with lead).',
    ],
    http: { path: '/sendSMSMessage', verb: 'get' },
    accepts: [
      { arg: 'body', type: 'string' },
      { arg: 'to', type: 'string' },
      { arg: 'from', type: 'string' },
    ],
    returns: [
      { arg: 'data', type: 'string' },
    ]
  });

  Proxy.sendLeadSMSMessage = (body, to, from, aId, leadId, cb) => {
    const { Message, Lead } = Proxy.app.models;
    client.messages
      .create({ body, to, from })
      .then(response => Message.create({
        in: false,
        fr: from,
        to,
        tx: body,
        rv: false,
        aId,
        leadId
      })
      .then(() => Lead.findOne({ where: { id: leadId, ph: to } })
          .then(lead => sendMessageToHubSpot({ message: response, hubSpotId: lead.hs })
              .then(() => cb(null, response))
            )
      ))
      .catch(e => console.log(e))
      .done();
  };

  Proxy.remoteMethod('sendLeadSMSMessage', {
    description: [
      'Send lead a message and save it.',
    ],
    http: { path: '/sendLeadSMSMessage', verb: 'get' },
    accepts: [
      { arg: 'body', type: 'string' },
      { arg: 'to', type: 'string' },
      { arg: 'from', type: 'string' },
      { arg: 'aId', type: 'string' },
      { arg: 'leadId', type: 'string' },
    ],
    returns: [
      { arg: 'data', type: 'string' },
    ]
  });

  Proxy.receiveSMSMessage = (MessageSid, Body, To, From, cb) => {
    const { Account, Message } = Proxy.app.models;
    const { sanitize } = Proxy.app.models.SMSPhone;
    const { getAccountByPhone } = Proxy.app.models.Account;

    const sanitizedFrom = sanitize(From);
    const sanitizedTo = sanitize(To);

    console.log('::: Message Received :::');
    console.log('MessageSid :: ', MessageSid);
    console.log('Body :: ', Body);
    console.log('From :: ', sanitizedFrom);
    console.log('To :: ', sanitizedTo);

    // get account
    getAccountByPhone(sanitizedTo)
      .then(aId => Account.getLeadByPhone(aId, sanitizedFrom)
        .then(lead => Message.create({
            in: true,
            fr: sanitizedFrom,
            to: sanitizedTo,
            tx: Body,
            rv: false,
            aId,
            leadId: lead.id
          })
        .then(message => handleInboundMessageToHubSpot(message))
        .then(result => cb(null, result)))
      )
      .catch(err => cb(err, Body));
  };

  Proxy.remoteMethod('receiveSMSMessage', {
    description: [
      'Handle POST from Twilio from hook.',
    ],
    http: { path: '/receiveSMSMessage', verb: 'post' },
    accepts: [
      { arg: 'MessageSid', type: 'any' },
      { arg: 'Body', type: 'any' },
      { arg: 'To', type: 'any' },
      { arg: 'From', type: 'any' },
    ],
    returns: [{ type: 'object', root: true }], // TODO: not yet returning valid XML
  });
};
