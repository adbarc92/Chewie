const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

exports.handler = (event, context, callback) => {
  const { to, from } = event.Records[0].messageAttributes;

  return client.messages
    .create({
      body: event.Records[0].body,
      from: from.stringValue,
      to: to.stringValue
    })
    .then(() => callback(null, 'Message Sent'))
    .catch(err => callback(err))
    .done();
};
