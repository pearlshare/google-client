require("should");
var Client = require("../lib/client");

describe("geocode", function () {

  var googleClient;
  before(function () {
    googleClient = new Client({
      key: "GOOGLE_MAPS_APIKEY",
      logger: console
    });
  });

  it("should contain geocode", function () {
    googleClient.should.have.ownProperty("geocode");
  });
});
