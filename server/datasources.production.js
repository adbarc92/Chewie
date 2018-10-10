console.log(`USING PRODUCTION DATASOURCE::${process.env.MONGODB_URI}`);
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
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }
    }]
  },
  MongoDB: {
    name: 'MongoDB',
    connector: 'loopback-connector-mongodb',
    url: process.env.MONGODB_URI
  }
};
