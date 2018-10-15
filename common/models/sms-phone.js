'use strict';

module.exports = function(Smsphone) {
  Smsphone.sanitize = phone => phone.toString().replace(/[^0-9]/g, '').trim();
};
