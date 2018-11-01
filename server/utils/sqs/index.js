const AWS = require('aws-sdk');
const Agenda = require('agenda');
const { Account, DNC, Message } = require('../../server').models;

AWS.config.update({ region: 'us-west-1' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const connectionString = process.env.MONGODB_URI || `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/sdcs_chewie`;
const agenda = new Agenda({ db: { address: connectionString } });

agenda.define('receiveDncQueue', () => {
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
        const { campaignPhone, leadPhone } = message.MessageAttributes;

        Account.getAccountByPhone(campaignPhone.StringValue.replace('+1', ''))
          .then((aId) => {
            DNC.findOrCreate({ where: { ph: leadPhone.StringValue.replace('+1', '') } }, {
              ph: leadPhone.StringValue.replace('+1', ''),
              tx: true,
              aId
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
      });
    }
  });
});

agenda.define('receiveResponseQueue', () => {
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
        const { campaignPhone, leadPhone } = message.MessageAttributes;

        Account.getAccountByPhone(campaignPhone.StringValue.replace('+1', ''))
          .then((account) => {
            Account.getLeadByPhone(account.aId, leadPhone.StringValue.replace('+1', ''))
              .then((lead) => {
                Message.create({
                  in: true,
                  fr: leadPhone.StringValue.replace('+1', ''),
                  to: campaignPhone.StringValue.replace('+1', ''),
                  tx: message.Body,
                  aId: account.aId,
                  leadId: lead.id
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
                .catch(error => console.log('Message.create Error', error));
              })
              .catch(error => console.log('getLeadByPhone Error', error));
          })
          .catch(errors => console.log('getAccountByPhone Error', errors));
      });
    }
  });
});

module.exports = {
  sendCampaignMessages(campaign) {
    console.log("campaign",campaign);
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
  },

  startAgenda() {
    agenda.on('ready', () => {
      console.log('Agenda Ready');
      agenda.every('1 minute', ['receiveDncQueue', 'receiveResponseQueue']);
      agenda.start();
    });
  }
};
