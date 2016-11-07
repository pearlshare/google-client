require("should");
var Client = require("../lib/client");

describe("geocode", function () {

  describe("geocode", function () {

    var googleClient;
    before(function () {
      googleClient = new Client({
        key: "GOOGLE_MAPS_APIKEY"
      });
    });

    it("should error if not address provided", function () {
      (googleClient.geocode).should.throw();
    });
  });


  describe("reverseGeocode", function () {

    var googleClient;
    before(function () {
      googleClient = new Client({
        key: "GOOGLE_MAPS_APIKEY"
      });
    });

    it("should error if no latlon is provided", function () {
      (googleClient.reverseGeocode).should.throw();
    });
  });
});
