const _ = require('lodash');

module.exports = (app) => {
  const Role = app.models.Role;
  const User = app.models.user;
  const RoleMapping = User.app.models.RoleMapping;

/**
   * Add a user to the given role.
   * @param {string} userId
   * @param {string} roleId
   * @param {Function} cb
   */
  User.addRole = (userId, roleId, cb) => {
    let error;

    User.findOne({ where: { id: userId } }, (err, user) => {
      if (err) cb(err);

      if (!_.isEmpty(user)) {
        Role.findOne({ where: { id: roleId } }, (errRole, role) => {
          if (errRole) cb(errRole);

          if (!_.isEmpty(role)) {
            RoleMapping.findOne({ where: { principalId: userId, roleId } },
              (errRoleMap, roleMapping) => {
                if (errRoleMap) cb(errRoleMap);
                if (_.isEmpty(roleMapping)) {
                  role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: user.id
                  }, (errPrincipal) => {
                    if (errPrincipal) cb(errPrincipal);
                    cb(null, role);
                  });
                } else {
                  cb(null, role);
                }
              });
          } else {
            error = new Error(`Role. ${roleId} was not found.`);
            error.http_code = 404;
            cb(error);
          }
        });
      } else {
        error = new Error(`User. ${userId} was not found.`);
        error.http_code = 404;
        cb(error);
      }
    });
  };

  User.remoteMethod(
    'addRole',
    {
      accepts: [
        { arg: 'userId', type: 'string' },
        { arg: 'roleId', type: 'string' }
      ],
      http: {
        path: '/add-role',
        verb: 'post'
      },
      returns: { type: 'object', root: true }
    }
  );

  /**
   * Remove a user from the given role.
   * @param {string} userId
   * @param {string} roleId
   * @param {Function} cb
   */
  User.removeRole = (userId, roleId, cb) => {
    let error;

    User.findOne({ where: { id: userId } }, (err, user) => {
      if (err) cb(err);

      if (!_.isEmpty(user)) {
        Role.findOne({ where: { id: roleId } }, (errRole, role) => {
          if (errRole) cb(err);
          if (!_.isEmpty(role)) {
            RoleMapping.findOne({ where: { principalId: userId, roleId } },
              (errRoleMapping, roleMapping) => {
                if (errRoleMapping) cb(errRoleMapping);
                if (!_.isEmpty(roleMapping)) {
                  roleMapping.destroy((errMap) => {
                    if (errMap) cb(errMap);
                    cb(null, role);
                  });
                } else {
                  cb(null, role);
                }
              });
          } else {
            error = new Error(`Role. ${roleId} was not found.`);
            error.http_code = 404;
            cb(error);
          }
        });
      } else {
        error = new Error(`User. ${userId} was not found.`);
        error.http_code = 404;
        cb(error);
      }
    });
  };

  User.remoteMethod(
    'removeRole',
    {
      accepts: [
        { arg: 'userId', type: 'string' },
        { arg: 'roleId', type: 'string' }
      ],
      http: {
        path: '/remove-role',
        verb: 'post'
      }
    }
  );

  Role.registerResolver('ADMIN', (role, context, cb) => {
    const userId = context.accessToken.userId;
    if (!userId) {
      return process.nextTick(() => cb(null, false));
    }

    RoleMapping.find({ where: { principalType: 'ADMIN' } }, (err, allAdmins) => {
      if (err) cb(false);
      const currentUser = allAdmins.filter(x => (x.principalId === userId.toString()));
      return cb(null, currentUser.length > 0);
    });

    return true;
  });
};
