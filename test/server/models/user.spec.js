const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../../../server/server');

const { User, RoleMapping } = app.models;
let principalId;
let authToken;

describe('User Model', function() {
  this.timeout(6500);

  before((done) => {
    // fixture data for a user we will create for this set of tests
    const data = {
      fullName: 'TEST USER',
      firstName: 'TEST',
      lastName: 'USER',
      email: 'testing@user.com',
      username: 'testUser',
      emailVerified: true,
      password: 'testPass4000'
    };

    User.findOrCreate({ where: { username: 'testUser' } }, data,
    (e, user) => {
      if (e) console.log(e);
      // assign the user the ADMIN role so we can get a token
      RoleMapping.create({
        principalType: 'ADMIN',
        principalId: user.id,
      }, (err, role) => {
        if (err) console.log(e);
        // Password must be passed as a string
        User.login({ username: user.username, password: 'testPass4000' }, (errLogin, token) => {
          if (errLogin) console.log(errLogin);
          authToken = token.id;
          done();
        });
      });
    });
  });

  after((done) => {
    // remove the user we created and the role mapping to the user
    User.remove({ username: 'testUser' }, (err, user) => {
      if (err) {
        console.log(`Error removing user: ${err}`);
        return;
      }
      RoleMapping.remove({ principalId: user.id}, (err, res) => done());
    });
  });

  it('GET responds with a 200 response code', () => {
    chai.request(app)
      .get('/api/Users')
      .set('Authorization', authToken)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.be.greaterThan(0);
        });
  });

  xit('should return true if user is admin', () => {
    User.isAdminRole(principalId, (e, response) => {
      expect(response).to.be.true;
    });
  });
});
