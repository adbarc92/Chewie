module.exports = {
  restApiRoot: '/api',
  host: '0.0.0.0',
  port: process.env.PORT,
  cookieSecret: '246bace2-38cb-4138-85d9-0ae8160b07c',
  remoting: {
    context: false,
    rest: {
      handleErrors: false,
      normalizeHttpPath: false,
      xml: false
    },
    json: {
      strict: false,
      limit: '100kb'
    },
    urlencoded: {
      extended: true,
      limit: '100kb'
    },
    cors: false
  }
};
