var GoogleMaps = require("@google/maps");
var logger = require("./logger");
var Debug = require("debug");

var debug = new Debug("googleClient:client");

module.exports = function (options) {

  if (!options.key) {
    debug("No key given %j", options);
    throw new Error("No key given");
  }

  var newLogger = logger.inject(options.logger);

  var googleMapsClient = new GoogleMaps.createClient({
    key: options.key
  });
  newLogger.info("Initialized google map client");

  return require("./geocode")(googleMapsClient, logger);
};
