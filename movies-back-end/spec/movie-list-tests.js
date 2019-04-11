var request = require("request");

var base_url = "http://localhost:4000/";
var Movie =require('../models/movie.model');

describe("Movies List Server", function() {
  describe("GET /", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });

  describe("GET /:id", function() {
      it("returns status code 400", function(done) {
        var dummy_test_id = '11111'
      request.get(base_url+dummy_test_id, function(error, response, body) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });
  });
});
