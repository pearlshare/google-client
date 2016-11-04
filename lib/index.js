var GoogleMaps = require("@google/maps");
var geocode = require("lib/geocode");
var Debug = require("debug");

var debug = new Debug("googleClient:index");

function GoogleClient (key, logger) {

  if (!key) {
    throw new Error("No key given");
  }

  var googleMapsClient = new GoogleMaps.createClient({
    key: key
  });

  return {
    geocode: geocode(googleMapsClient)
  };
}

module.exports = GoogleClient;
