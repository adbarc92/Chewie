const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../../../server/server');

const { User, RoleMapping, Account, Lead, Message, DNC } = app.models;
let authToken;
let admin;
let account;
let lead;

describe('User Model', function() {
  this.timeout(6500);

  before((done) => {
    // fixture data for a user we will create for this set of tests
    const mockUserData = {
      fullName: 'TEST USER',
      firstName: 'TEST',
      lastName: 'USER',
      email: 'testing@account.com',
      username: 'testAccount',
      emailVerified: true,
      password: 'testPass4000'
    };

    const mockAccountData = {
      CompanyName: 'TEST COMPANY',
      streetAddress1: '123 Some Street',
      city: 'San Diego',
      state: 'CA',
      postalCode: '92128',
      responsibleParty: 'Test Testerson',
      email: 'test@test.com',
      phone: '6191234567',
      active: true
    };

    const mockLeadData = {
      ph: '6192224444',     // phone number
      fn: 'TEST',           // first name
      ln: 'LEADERSON',      // last name
      em: 'test@email.com', // email address
      hs: '12345'           // hubspot id
    };

    const mockMessageData = {
      in: false,                    // is inbound text message
      fr: '6192224444',             // sent from number/email
      to: '6192224444',             // sent to number/email
      tx: 'This is a test message', // text of the message
      sb: 'Email subject here',     // subject of the message
      sc: 100,                      // sentiment score
      rv: false                     // been reviewed
    };

    const createAdminUser = () => new Promise((resolve, reject) =>
        User.findOrCreate({ where: { username: 'testAccount' } }, mockUserData,
        (e, user) => {
          if (e) reject(e);
          admin = user;
          // assign the user the ADMIN role so we can get a token
          RoleMapping.create({
            principalType: 'ADMIN',
            principalId: user.id,
          }, (err) => {
            if (err) reject(e);
            // Password must be passed as a string
            User.login({ username: user.username, password: 'testPass4000' },
              (errLogin, token) => {
                if (errLogin) console.log(errLogin);
                authToken = token.id;
                // console.log(token);
                resolve(user);
              });
          });
        })
    );

    const createAccount = () => new Promise((resolve, reject) =>
      Account.findOrCreate({ where: { CompanyName: 'TEST COMPANY' } }, mockAccountData,
        (e, response) => {
          if (e) reject(e);
          account = response;
          // console.log(account);
          resolve(account);
        })
      );

    const createLead = () => new Promise((resolve, reject) => {
      mockLeadData.aId = account.id;
      Lead.findOrCreate({ where: { ph: '6192224444' } }, mockLeadData,
        (e, response) => {
          if (e) reject(e);
          lead = response;
          // console.log(lead);
          resolve(lead);
        }
      );
    });

    const createMessage = () => new Promise((resolve, reject) => {
      mockMessageData.leadId = lead.id;
      mockMessageData.aId = account.id;
      Message.findOrCreate({ where: { to: '6192224444' } }, mockMessageData,
        (e, response) => {
          if (e) reject(e);
          // console.log(response);
          resolve(response);
        }
      );
    });

    createAdminUser()
      .then(createAccount)
      .then(createLead)
      .then(createMessage)
      .then(() => done())
      .catch(e => console.log(e));
  });

  after((done) => {
    const destroyUser = () => new Promise((resolve, reject) => {
      User.remove({ username: 'testAccount' }, (errUserRemove) => {
        if (errUserRemove) reject(errUserRemove);
        resolve();
      });
    });

    const destroyRoleMapping = () => new Promise((resolve, reject) => {
      RoleMapping.remove({ principalId: admin.id }, (errRoleMapping) => {
        if (errRoleMapping) reject(errRoleMapping);
        resolve();
      });
    });

    const destroyAccount = () => new Promise((resolve, reject) => {
      Account.remove({ CompanyName: 'TEST COMPANY' }, (errRemoveAccount) => {
        if (errRemoveAccount) reject(errRemoveAccount);
        resolve();
      });
    });

    const destroyDNC = () => new Promise((resolve, reject) => {
      DNC.remove({ ph: '6193334444' }, (errRemoveDNC) => {
        if (errRemoveDNC) reject(errRemoveDNC);
        resolve();
      });
    });

    const destroyLead = () => new Promise((resolve, reject) => {
      Lead.remove({ ph: '6192224444' }, (errRemoveLead) => {
        if (errRemoveLead) reject(errRemoveLead);
        resolve();
      });
    });

    const destroyMessage = () => new Promise((resolve, reject) => {
      Message.remove({ to: '6192224444' }, (errRemoveMessage) => {
        if (errRemoveMessage) reject(errRemoveMessage);
        resolve();
      });
    });

    destroyUser()
      .then(destroyRoleMapping)
      .then(destroyAccount)
      .then(destroyDNC)
      .then(destroyLead)
      .then(destroyMessage)
      .then(() => done())
      .catch(err => console.log(err));
  });

  it('GET responds with a 200 response code', () => {
    chai.request(app)
      .get('/api/Users')
      .set('Authorization', authToken)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.be.greaterThan(0);
          // console.log('Found users (2) will be shown.');
          // console.log(res.body.slice(0, 2));
        });
  });

  it('GET Accounts responds with a 200 response code', () => {
    chai.request(app)
      .get('/api/Accounts')
      .set('Authorization', authToken)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.be.greaterThan(0);
          // console.log(`found ${res.body.length} accounts in the system.`);
        });
  });

  it('POST DNC responds with a 200 response code', () => {
    chai.request(app)
      .post(`/api/Accounts/${account.id}/dNCs`)
      .set('Authorization', authToken)
      .type('form')
      .send({
        ph: '6193334444',
        tx: true,
        aId: account.id
      })
        .then((res) => {
          expect(res).to.have.status(200);
          // console.log(`Created a dnc document.`);
          // console.log(res.body);
        });
  });

  it('GET DNC responds with a 200 response code', () => {
    chai.request(app)
      .get('/api/DNCs')
      .set('Authorization', authToken)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.be.greaterThan(0);
          // console.log(`Found ${res.body.length} DNC records`);
        });
  });

  it('GET DNC by account responds with a 200 response code', () => {
    chai.request(app)
      .get(`/api/Accounts/${account.id}/dNCs`)
      .set('Authorization', authToken)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.be.greaterThan(0);
          // console.log(`Found ${res.body.length} DNC records for account # ${account.id}`);
        });
  });

  it('POST Lead responds with a 200 response code', () => {
    chai.request(app)
      .post(`/api/Accounts/${account.id}/leads`)
      .set('Authorization', authToken)
      .type('form')
      .send({
        ph: '6192224444',
        em: 'test@test.com',
        fn: 'TEST',
        ln: 'LEADERSON',
        hs: '12345',
        aId: account.id
      })
        .then((res) => {
          lead = { id: res.body.id.toString() };
          expect(res).to.have.status(200);
          // console.log('Created a lead document.');
          // console.log(res.body);
        });
  });

  it('POST Message responds with a 200 response code', () => {
    return chai.request(app)
      .post(`/api/Accounts/${account.id}/leads/${lead.id}/messages`)
      .set('Authorization', authToken)
      .type('form')
      .send({
        to: '6192224444',
        fr: '6192224444',
        fn: 'TEST',
        ln: 'LEADERSON',
        hs: '12345',
        aId: account.id
      })
        .then((res) => {
          expect(res).to.have.status(200);
          // console.log('Created a message document.');
          // console.log(res.body);
        });
  });

  it('POST Second message responds with a 200 response code', () => {
    chai.request(app)
      .post(`/api/Accounts/${account.id}/leads/${lead.id}/messages`)
      .set('Authorization', authToken)
      .type('form')
      .send({
        to: '6192224444',
        fr: '6192224444',
        fn: 'TEST',
        ln: 'LEADERSON',
        hs: '12345',
        aId: account.id
      })
        .then((res) => {
          expect(res).to.have.status(200);
          // console.log(`Created a message document.`);
          // console.log(res.body);
        });
  });

  it('GET Messages by account responds with a 200 response code', () => {
    chai.request(app)
      .get(`/api/Accounts/${account.id}/leads/${lead.id}/messages`)
      .set('Authorization', authToken)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.be.greaterThan(0);
          // console.log(`Found ${res.body.length} message records for lead # ${lead.id}`);
        });
  });
});
