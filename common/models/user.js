const _ = require('lodash');
const winston = require('winston');
require('winston-loggly-bulk');
const { sendCommentToHubSpot } = require('../../server/utils/hubspot/index');

module.exports = (user) => {
  user.isAdminRole = (userId, cb) => {
    const Role = user.app.models.Role;
    const RoleMapping = user.app.models.RoleMapping;

    Role.findOne({ where: { name: 'ADMIN' } }, (errFindOne, role) => {
      if (errFindOne) cb(null, false);
      if (!_.isEmpty(role)) {
        RoleMapping.find({ where: { principalType: 'ADMIN' } }, (errFind, allAdmins) => {
          if (errFind) cb(null, false);
          const currentUser = allAdmins.filter(x => x.principalId === userId.toString()); // needs to be truthy
          cb(null, currentUser.length > 0);
        });
      } else {
        cb(null, false);
      }
    });
  };

  user.remoteMethod('isAdminRole', {
    isStatic: true,
    accepts: [
      { arg: 'userId', type: 'string', http: { source: 'query' } }
    ],
    returns: [
      { arg: 'isAdminRole', type: 'boolean' }
    ],
    http: { path: '/isAdminRole', verb: 'get' }
  });
  
  const getAdminByID = x =>
    new Promise((resolve, reject) =>
      user.findById(x.principalId)
        .then(result => resolve(result))
        .catch(error => reject(error)));

  user.getAllAdmins = (cb) => {
    const Role = user.app.models.Role;
    const RoleMapping = user.app.models.RoleMapping;

    Role.findOne({ where: { name: 'ADMIN' } }, (errFindOne, role) => {
      if (errFindOne) cb(null, []);
      if (!_.isEmpty(role)) {
        RoleMapping.find({ where: { principalType: 'ADMIN' } }, (errFind, allAdmins) => {
          if (errFind) cb(null, false);
          const results = allAdmins.map(getAdminByID);
          Promise.all(results)
            .then(response => cb(null, response))
            .catch((error) => { throw error; });
        });
      } else {
        cb(null, false);
      }
    });
  };

  user.remoteMethod('getAllAdmins', {
    isStatic: true,
    returns: [
      { arg: 'users', type: 'array' }
    ],
    http: { path: '/getAllAdmins', verb: 'get' }
  });

  user.sendCommentToHubSpot = (data, cb) => {
    return sendCommentToHubSpot(data)
      .catch(err => cb(err));
  }

  user.remoteMethod('sendCommentToHubSpot', {
    isStatic: true,
    accepts: [
      { arg: 'data', type: 'object', http: { source: 'body' } }
    ],
    returns: [
      { arg: 'hubspotCommentSent', type: 'boolean' }
    ],
    http: { path: '/sendCommentToHubSpot', verb: 'post' }
  });

  user.on('resetPasswordRequest', (info) => {
    const url = `http://${process.env.HOST_NAME}/resetPassword`;
    const html = `<h1>Password Recovery</h1>
                  <p>If you requested to reset your password, follow the link below.</p>
                  <p>Otherwise, you can ignore this message.</p>
                  <p>Click <a href="${url}?access_token=${info.accessToken.id}">here</a> to reset your password.</p>
                  <p>Thanks!</p>
                  <p>-The Team at Origin Code Academy</p>`;
    user.app.models.Email.send({
      to: info.email,
      from: process.env.ADMIN_EMAIL,
      subject: 'Password Reset Request',
      html
    }, (err) => {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
      return true;
    });
  });
};
