module.exports = {
  myEmailDataSource: {
    name: 'myEmailDataSource',
    connector: 'mail',
    transports: [{
      type: 'smtp',
      host: 'smtp.sendgrid.net',
      secure: false,
      port: 587,
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API
      }
    }]
  },
  MongoDB: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    name: 'MongoDB',
    database: 'sdcs_chewie',
    connector: 'mongodb'
  }
};
