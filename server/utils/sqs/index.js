const AWS = require('aws-sdk');

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

module.exports = {
  messageToTwilio(lead) {
    const { to, from, message } = lead;

    const params = {
      DelaySeconds: 0,
      MessageAttributes: {
        to: {
          DataType: 'String',
          StringValue: `+1${to}`
        },
        from: {
          DataType: 'String',
          StringValue: `+1${from}`
        },
        message: {
          DataType: 'String',
          StringValue: message
        }
      },
      MessageBody: 'Sent message to Twilio',
      QueueUrl: process.env.SEND_TO_TWILIO_QUEUE
    };

    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Success', data.MessageId);
      }
    });
  },

  receiveUserDncQueue() {
    const params = {
      AttributeNames: [
        'SentTimestamp'
      ],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: [
        'All'
      ],
      QueueUrl: process.env.SAVE_USER_DNC_QUEUE,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0
    };

    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        console.log('Receive Error', err);
      } else if (data.Messages) {
        data.Messages.forEach((message) => {
          const deleteParams = {
            QueueUrl: process.env.SAVE_USER_DNC_QUEUE,
            ReceiptHandle: message.ReceiptHandle
          };
          sqs.deleteMessage(deleteParams, (error, datas) => {
            if (error) {
              console.log('Delete Error', err);
            } else {
              console.log('Message Deleted', datas);
            }
          });
        });
      }
    });
  },

  receiveUserResponseQueue() {
    const params = {
      AttributeNames: [
        'SentTimestamp'
      ],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: [
        'All'
      ],
      QueueUrl: process.env.SAVE_USER_RESPONSE_QUEUE,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0
    };

    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        console.log('Receive Error', err);
      } else if (data.Messages) {
        data.Messages.forEach((message) => {
          const deleteParams = {
            QueueUrl: process.env.SAVE_USER_RESPONSE_QUEUE,
            ReceiptHandle: message.ReceiptHandle
          };
          sqs.deleteMessage(deleteParams, (error, datas) => {
            if (error) {
              console.log('Delete Error', err);
            } else {
              console.log('Message Deleted', datas);
            }
          });
        });
      }
    });
  },
};
