const { startAgenda } = require('../../server/utils/sqs');

startAgenda();

module.exports = (app) => {
  const User = app.models.user;
  const Account = app.models.Account;
  const SMSPhone = app.models.SMSPhone;
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;

  let account;

  User.findOrCreate({
    where: {
      username: 'admin',
    },
  },
    {
      username: 'admin',
      email: process.env.ADMIN_EMAIL,
      firstName: 'Admin',
      lastName: 'Account',
      password: process.env.ADMIN_PASSWORD,
      emailVerified: true,
    },
    (err, user) => {
      if (err) console.log(err);

      Account.findOrCreate({
        where: {
          companyName: 'Chewie',
        },
      },
        {
          companyName: 'Chewie',
          paymentToken: 'NONE',
          streetAddress1: 'NONE',
          streetAddress2: 'NONE',
          city: 'San Diego',
          state: 'CA',
          postalCode: '92129',
          responsibleParty: 'admin',
          email: process.env.ADMIN_EMAIL,
          phone: process.env.ADMIN_MOBILE,
          active: true,
          userId: user.id
        }, (errAccount, accountResult) => {
          if (errAccount) console.log(errAccount);
          console.log('The admin account info is:');
          console.log(accountResult);
          account = accountResult.id;

          // cache the current admin account id globally for quick access
          process.env.ADMIN_ACCOUNT_ID = account;

          SMSPhone.findOrCreate({
            where: {
              aId: account
            }
          },
            {
              phone: process.env.PHONE_1,
              isActive: true,
              aId: account
            }, (errSMS, smsResult) => {
              if (errSMS) console.log(errSMS);
              console.log('A SMS phone has been added.');
              console.log(smsResult);
            });
        }
      );

      Role.findOrCreate({
        where: {
          name: 'ADMIN',
        },
      },
        {
          name: 'ADMIN',
        },
        (errRole, role) => {
          if (errRole) console.log('error creating role', errRole);
          RoleMapping.findOrCreate({
            where: {
              principalType: 'ADMIN',
            },
          },
            {
              principalType: 'ADMIN',
              principalId: user.id,
            }, (error, mapping) => {
              if (error) console.log(error);
            });
        });
    });
};
