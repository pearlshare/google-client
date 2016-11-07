require("should");
var Client = require("../lib/client");

describe("client", function () {

  it("should throw an error when API KEY is not provided", function () {
    (Client).should.throw();
  });


  it("should not throw an error when logger is not provided", function () {
    new Client({
      key: "GOOGLE_API_KEY"
    });
  });


  describe("properties", function () {

    var googleClient;
    before(function () {
      googleClient = new Client({
        key: "GOOGLE_MAPS_APIKEY"
      });
    });

    it("should contain property geocode", function () {
      googleClient.should.have.ownProperty("geocode");
    });

    it("should contain property reverseGeocode", function () {
      googleClient.should.have.ownProperty("reverseGeocode");
    });
  });
});
