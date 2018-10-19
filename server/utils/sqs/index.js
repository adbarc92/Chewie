const AWS = require('aws-sdk');
const axios = require('axios');
const Agenda = require('agenda');

AWS.config.update({ region: 'us-west-1' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const mongoConnectionString = `mongodb://${process.env.MONGO_HOST}/agenda` || `mongodb:${process.env.MONGODB_URI}/agenda`;
const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define('receiveDncQueue', () => {
  console.log('[ ]Checking DNC Queue...');
  const params = {
    AttributeNames: [
      'SentTimestamp'
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
      'All'
    ],
    QueueUrl: process.env.DNC_QUEUE,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 20
  };

  sqs.receiveMessage(params, (err, data) => {
    if (err) {
      console.log('Receive Error', err);
    } else if (data.Messages) {
      data.Messages.forEach((message) => {
        axios.post('http://localhost:3030/api/DNCs', {
          ph: message.MessageAttributes.p.StringValue.replace('+1', ''),
          tx: true
        })
        .then(() => {
          const deleteParams = {
            QueueUrl: process.env.DNC_QUEUE,
            ReceiptHandle: message.ReceiptHandle
          };
          sqs.deleteMessage(deleteParams, (error, datas) => {
            if (error) {
              console.log('Delete Error', err);
            } else {
              console.log('DNC Message Deleted', datas);
            }
          });
        })
        .catch(error => console.log(error));
      });
    }
  });
});

agenda.define('receiveResponseQueue', () => {
  console.log('Checking Response Queue');
  const params = {
    AttributeNames: [
      'SentTimestamp'
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
      'All'
    ],
    QueueUrl: process.env.RESPONSE_QUEUE,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 20
  };

  sqs.receiveMessage(params, (err, data) => {
    if (err) {
      console.log('Receive Error', err);
    } else if (data.Messages) {
      data.Messages.forEach((message) => {
        axios.post('http://localhost:3030/api/Messages', {
          in: true,
          fr: message.MessageAttributes.fr.StringValue.replace('+1', ''),
          to: message.MessageAttributes.p.StringValue.replace('+1', ''),
          tx: message.Body,
        })
        .then(() => {
          const deleteParams = {
            QueueUrl: process.env.RESPONSE_QUEUE,
            ReceiptHandle: message.ReceiptHandle
          };
          sqs.deleteMessage(deleteParams, (error, datas) => {
            if (error) {
              console.log('Delete Error', err);
            } else {
              console.log('Response Message Deleted', datas);
            }
          });
        })
        .catch(error => console.log(error));
      });
    }
  });
});

agenda.on('ready', () => {
  agenda.every('1 minute', ['receiveResponseQueue', 'receiveDncQueue']);
  agenda.start();
});

module.exports = {
  sendCampaignMessages(campaign) {
    const { leads, fr, message } = campaign;
    let delaySeconds = 1;

    leads.forEach((lead) => {
      const params = {
        DelaySeconds: delaySeconds,
        MessageAttributes: {
          to: {
            DataType: 'String',
            StringValue: `+1${lead.ph}`
          },
          from: {
            DataType: 'String',
            StringValue: `+1${fr}`
          },
        },
        MessageBody: message,
        QueueUrl: process.env.SEND_TO_TWILIO_QUEUE
      };

      sqs.sendMessage(params, (err, data) => {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success', data.MessageId);
        }
      });

      delaySeconds += 1;
    });
  }
};
