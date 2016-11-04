require("should");
var Client = require("../lib/client");

describe("geocode", function () {

  var googleClient;
  before(function () {
    googleClient = new Client("testKey", console);
  });

  it("should contain geocode", function () {
    console.log(googleClient)
    googleClient.geocode.should.be.function();
  });
});
