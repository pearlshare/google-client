var GoogleMaps = require("@google/maps");
var geocode = require("./geocode");
var dummyLogger = require("./dummy_logger");
var Debug = require("debug");

var debug = new Debug("googleClient:client");

module.exports = function client (key, logger) {

  if (!key) {
    throw new Error("No key given");
  }
  if (!logger) {
    logger = dummyLogger;
  }

  var googleMapsClient = new GoogleMaps.createClient({
    key: key
  });
  logger.info("Initialized google map client");

  return {
    geocode: geocode.geocode(googleMapsClient)
  };
};
