const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../../../server/server');

describe('Proxy Model', function() {
  this.timeout(6500);

  const Proxy = app.models.Proxy;

  it('should have a function named checkIn', () => {
    expect(Proxy).to.exist;
    expect(Proxy.checkIn).to.be.a.function;
  });

  it('should have a function named validateStudentByEmail', () => {
    expect(Proxy).to.exist;
    expect(Proxy.validateStudentByEmail).to.be.a.function;
  });
});
