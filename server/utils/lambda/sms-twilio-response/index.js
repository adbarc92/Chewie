const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-1' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

exports.handler = (event, context, callback) => {
  const params = event.Body.toLowerCase() === 'stop' ?
  {
    DelaySeconds: 0,
    MessageAttributes: {
      leadPhone: {
        DataType: 'String',
        StringValue: event.From
      },
      campaignPhone: {
        DataType: 'String',
        StringValue: event.To
      }
    },
    MessageBody: event.Body,
    QueueUrl: process.env.saveUserDncQueue
  } :
  {
    DelaySeconds: 0,
    MessageAttributes: {
      leadPhone: {
        DataType: 'String',
        StringValue: event.From
      },
      campaignPhone: {
        DataType: 'String',
        StringValue: event.To
      }
    },
    MessageBody: event.Body,
    QueueUrl: process.env.saveUserResponseQueue
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success', data.MessageId);
      callback(null, 'Sent to Queue');
    }
  });
};
