const amqp = require('amqplib/callback_api');
const axios = require('axios');

module.exports = {
  sendToQueue(input) {
    amqp.connect(process.env.CLOUD_AMQP_URL)
      .then((conn) => {
        conn.createChannel((error, ch) => {
          const { exchange, queue, data } = input;

          ch.assertExchange(exchange, 'direct', { durable: false });
          ch.assertQueue(queue);
          ch.bindQueue(queue, exchange, queue);
          ch.publish(exchange, queue, Buffer.from(JSON.stringify(data)));
        })
        .then(() => { conn.close(); });
      });
  },

  receiveFromQueue() {
    amqp.connect(process.env.CLOUD_AMQP_URL, (err, conn) => {
      conn.createChannel((err, ch) => {
        ch.assertExchange('exchange', 'direct', { durable: false });
        ch.assertQueue('send_to_twilio');
        ch.assertQueue('update_dnc');
        ch.assertQueue('save_user_response');

        ch.consume('send_to_twilio', (msg) => {
          const { from, p, message } = JSON.parse(msg.content);
          axios.get(`${process.env.MESSAGE_TWILIO_LAMBDA_URL}?to=+1${p}&from=+1${from}&message=${message}`)
            .catch(error => console.log(error));
          console.log(` [x] Received send_to_twilio: ${JSON.parse(msg.content)}`);
        }, { noAck: true });

        ch.consume('update_dnc', (msg) => {
          console.log(` [x] Received update_dnc: ${JSON.parse(msg.content)}`);
        }, { noAck: true });

        ch.consume('save_user_response', (msg) => {
          console.log(` [x] Received save_user_reponse: ${JSON.parse(msg.content)}`);
        }, { noAck: true });
      });
    });
  }
};
