var _ = require('lodash');

function isAdminRole(app, user, cb) {
  var Role = app.models.Role;
  var User = app.models.user;
  var RoleMapping = User.app.models.RoleMapping;

  Role.findOne({ where: { name: 'admin' } }, function(err, role) { // Find the role...
    if (err) cb(false); // Error
    if (!_.isEmpty(role)) {
      RoleMapping.find({ where: { roleId: role.id } }, function(err, allAdmins) { // Find the role mapping...
        if (err) cb(false); // Error
        console.log(`ROLE MAPPING:: ${JSON.stringify(allAdmins)}`);
        const currentUser = allAdmins.filter(x => x.principalId == user.id);
        console.log(`calling back with ${currentUser.length > 0}`);
        cb(currentUser.length > 0);
      });
    } else {
      cb(false);
    }
  });
}

module.exports = {
  isAdminRole
};
