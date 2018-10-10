/* */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server/server');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Server app', function mocha() {
  this.timeout(6500);

  it('Should not have an undefined model', () =>
    expect(app.models.doesnt).to.not.exist
  );

  it('Proxy model should exist', () =>
    expect(app.models.Proxy).to.exist
  );

  it('User model should exist', () =>
    expect(app.models.User).to.exist
  );

  it('GET / responds with a 200 response code', () =>
    chai.request(app)
      .get('/')
        .then((res) => {
          expect(res).to.have.status(200);
        })
  );
});
