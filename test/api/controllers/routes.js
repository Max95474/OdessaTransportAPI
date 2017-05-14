const should = require('should');
const request = require('supertest');
const server = require('../../../app');

describe('controllers', function() {
  describe('routes', function() {
    describe('GET /route/list', function() {
      it('should return a list of routes', function(done) {
        request(server)
          .get('/route/list')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            should.equal(Object.keys(res.body[0]).length, 9);
            done();
          });
      })
    });
    describe('GET /route/{id}', function() {
      it('should return a route by id', function(done) {
        request(server)
          .get('/route/99')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            should.equal(Object.keys(res.body).length, 11);
            done();
          })
      })
    })
  })
});