# Chewie

A UI to manage SMS marketing campaigns.

## Setup

```bash
$ npm install
```

You will need to create a file called `credentials.js` in the root folder with the following values:

```javascript
process.env.SECRET_COOKIE=''; // can be any value, just sets a unique hash for cookie auth
process.env.MONGO_HOST=''; // host for development/staging mongo
process.env.MONGO_PORT=''; // port for development/staging mongo
process.env.MONGODB_URI=''; // full url for production mongo
process.env.SENDGRID_API='';
process.env.GITHUB_CALLBACK_URL='';
process.env.ADMIN_PASSWORD='';
process.env.ADMIN_EMAIL='';
process.env.LOGGLY_TOKEN='';
process.env.HUBSPOT_ID=''; // unique value for the account
process.env.HUBSPOT_API='';
process.env.PORT=''; // port for the app
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

## Login info

The default admin username is `admin`. You must set the admin's default password via an environment variable (or in the credentials file):

```javascript
process.env.ADMIN_PASSWORD='';
```

## Contracts

Review the tests in `tests/server/models/account.spec.js`

---

## Local login

To use local strategy you must verify the email address.

## Auth Client Apps

[Google](https://console.developers.google.com/apis/credentials)
[GitHub](https://github.com/organizations/OriginCodeAcademy/settings/applications/629519)

## References:

[Loopback](https://github.com/mikedeboer/node-github)
[node-github](https://github.com/mikedeboer/node-github)
