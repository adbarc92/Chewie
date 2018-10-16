'use strict';

module.exports = function(Account) {
  Account.getAccountByPhone = (phone) => {
    const { SMSPhone } = Account.app.models;

    // since we have limited number of phones/accounts
    // if phone matche admin's, no need to look up account #
    if (phone === process.env.PHONE_1 || phone === process.env.PHONE_1) {
      return Promise.resolve(process.env.ADMIN_ACCOUNT_ID);
    }
    // else lookup the sms number and return the account id
    return new Promise((resolve, reject) => SMSPhone.findOne({ where: { phone } })
      .then(smsPhone => resolve(smsPhone.aId))
      .catch(e => reject(e)));
  };

  Account.getLeadByPhone = (aId, phone) => {
    const { Lead } = Account.app.models;

    return new Promise((resolve, reject) => Lead.findOne({ where: { aId, phone } })
      .then(lead => resolve(lead))
      .catch(e => reject(e)));
  };
};
