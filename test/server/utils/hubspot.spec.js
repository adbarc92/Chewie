const nock = require('nock');
const chai = require('chai');

const mocks = require('./fixtures/hubspotAPI');
const HS = require('../../../server/utils/hubspot/index');

const expect = chai.expect;

describe('hubspot module', function mocha() {
  this.timeout(6500);

  describe('getWakatimeByEmail should', function () {
    before(() => {
      nock.disableNetConnect();
      const apikey = process.env.HUBSPOT_API;
      nock('https://api.hubapi.com/contacts/v1/contact/email')
        .get(`/good@test.com/profile?hapikey=${apikey}`)
        .reply(200, mocks.goodEmailResponse);
      nock('https://api.hubapi.com/contacts/v1/contact/email')
        .get(`/bad@test.com/profile?hapikey=${apikey}`)
        .reply(404, mocks.badEmailResponse);
      nock('https://api.hubapi.com/contacts/v1/contact/email')
        .get(`/nokey@test.com/profile?hapikey=${apikey}`)
        .reply(200, mocks.goodEmailResponseNoKey);
    });

    after(() => {
      nock.cleanAll();
      nock.enableNetConnect();
    });

    it('have a function getWakatimeByEmail', () =>
      expect(HS.getWakatimeByEmail).to.exist
    );

    // it('handle 404, return null when no user profile by email', () =>
    //   HS.getWakatimeByEmail('bad@test.com')
    //     .then(result => expect(result).to.equal(null))
    // );

    it('return wakatime key found', () =>
      HS.getWakatimeByEmail('good@test.com')
        .then(result => expect(result).to.equal('a985-9fee5ad409b1'))
    );

    it('return 200, and no key', () =>
      HS.getWakatimeByEmail('nokey@test.com')
        .then(result => expect(result).to.equal(null))
    );
  });
});
