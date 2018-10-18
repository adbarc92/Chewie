const client = require('twilio')(process.env.accountSid, process.env.authToken);

exports.handler = (event, context, callback) => {
  const { to, from, message } = event.Records[0].messageAttributes;

  return client.messages
    .create({
      body: message.stringValue,
      from: from.stringValue,
      to: to.stringValue
    })
    .then(() => callback(null, 'Message Sent'))
    .done();
};
