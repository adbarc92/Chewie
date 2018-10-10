# Chewie

A UI to manage SMS marketing campaigns.

## Setup

```bash
$ npm install
```

You will need to create a file called `credentials.js` in the root folder with the following values:

```javascript
process.env.SECRET_COOKIE='';
process.env.MONGO_HOST='';
process.env.MONGO_PORT='';
process.env.MONGODB_URI='';
process.env.SENDGRID_API='';
process.env.GITHUB_CALLBACK_URL='';
process.env.ADMIN_PASSWORD='';
process.env.ADMIN_EMAIL='';
process.env.LOGGLY_TOKEN='';
process.env.HUBSPOT_ID='';
process.env.HUBSPOT_API='';
process.env.PORT='';
process.env.GOOGLE_CLIENT_ID1='';
process.env.GOOGLE_CLIENT_SECRET1='';
process.env.GOOGLE_CLIENT_ID2='';
process.env.GOOGLE_CLIENT_SECRET2='';
process.env.GITHUB_CLIENT_ID1='';
process.env.GITHUB_CLIENT_SECRET1='';
process.env.GITHUB_CLIENT_ID2='';
process.env.GITHUB_CLIENT_SECRET2='';
```

## Tests

```bash
$ npm run test
```

## Start

```bash
npm start
```

## Local login

To use local strategy you must verify the email address.

## Auth Client Apps

[Google](https://console.developers.google.com/apis/credentials)
[GitHub](https://github.com/organizations/OriginCodeAcademy/settings/applications/629519)

## References:

[Loopback](https://github.com/mikedeboer/node-github)
[node-github](https://github.com/mikedeboer/node-github)
