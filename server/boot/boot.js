const { receiveFromQueue } = require('../utils/rabbitmq');

receiveFromQueue();

module.exports = (app) => {
  const User = app.models.user;
  const Role = app.models.Role;
  const Account = app.models.Account;
  const RoleMapping = app.models.RoleMapping;

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
          CompanyName: 'Chewie',
        },
      },
        {
          CompanyName: 'Chewie',
          paymentToken: 'NONE',
          streetAddress1: 'NONE',
          streetAddress2: 'NONE',
          city: 'San Diego',
          state: 'CA',
          postalCode: '92129',
          responsibleParty: 'admin',
          email: 'test@test.com',
          phone: '9999999999',
          active: true,
          userId: user.id
        }, (errAccount, result) => {
          if (errAccount) console.log(errAccount);
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
