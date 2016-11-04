var GoogleMaps = require("@google/maps");
var dummyLogger = require("./dummy_logger");
var Debug = require("debug");

var debug = new Debug("googleClient:client");

module.exports = function client (options) {

  if (!options.key) {
    throw new Error("No key given");
  }

  if (!options.logger) {
    debug("No logger provided.");
    options.logger = dummyLogger;
  }

  var googleMapsClient = new GoogleMaps.createClient({
    key: options.key
  });
  options.logger.info("Initialized google map client");

  return {
    geocode: require("./geocode")(options)
  };
};
