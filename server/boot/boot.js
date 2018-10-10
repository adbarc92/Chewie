module.exports = (app) => {
  const User = app.models.user;
  const Role = app.models.Role;
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
