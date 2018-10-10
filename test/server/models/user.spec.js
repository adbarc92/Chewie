const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../../../server/server');

const { User, Role, RoleMapping } = app.models;
let principalId;
let roleId;
let roleMappingId;
let authToken;

describe('User Model', function() {
  this.timeout(6500);

  before((done) => {
    const data = {
      fullName: 'TEST Fullname',
      firstName: 'TEST lastname',
      lastName: 'TEST lastname',
      email: 'testing@example.com',
      moodleUserId: '0',
      progress: ['2017-10-31T16:52:05.169Z'],
      disabled: false,
      bookmark: '1',
      wakatimeApiKey: '6ee77bd4-0dbd-4875-9a06-fb92d18310a3',
      trackId: '',
      studentType: 'FULL',
      mockData: true,
      inClass: false,
      barcodeId: '8',
      username: 'test',
      emailVerified: true,
      password: 'testPass4000'
    };

    User.upsert(data, (e, user) => {
      if (e) {
        console.log(e);
      } else {
        principalId = user.id;
        Role.find({ name: 'ADMIN' }, (err, role) => {
          if (err) {
            console.log(err);
          } else {
            roleId = role.id;
            const roleMappingData = {
              principalType: 'ADMIN',
              principalId,
              roleId
            };
            RoleMapping.create(roleMappingData, (error, res) => {
              if (error) {
                console.log(error);
              } else {
                roleMappingId = res.id;
                const credentials = { username: 'test', password: 'testPass4000' };
                User.login(credentials, (errLogin, token) => {
                  if (errLogin) console.log(errLogin);
                  authToken = token.id;
                  done();
                });
              }
            });
          }
        });
      }
    });
  });

  after((done) => {
    RoleMapping.destroyById(roleMappingId, (e, role) => {
      if (e) {
        console.log(`Error removing role: ${e}`);
        return;
      }
      User.remove({ fullName: 'TEST Fullname', firstName: 'TEST lastname' }, (err, user) => {
        if (e) {
          console.log(`Error removing user: ${err}`);
          return;
        }
        done();
      });
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

  it('should return true if user is admin', () => {
    User.isAdminRole(principalId, (e, response) => {
      expect(response).to.be.true;
    });
  });
});
