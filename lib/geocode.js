var Bluebird = require("bluebird");
var Debug = require("debug");
var isEmpty = require("./util/is_empty");
var locationUtil = require("./util/location");
var formatAddress = require("./util/format_address");

var debug = new Debug("googleClient:geocode");

var googleConfidenceLookup = {
  ROOFTOP: 1,
  RANGE_INTERPOLATED: 0.9,
  GEOMETRIC_CENTER: 0.7,
  APPROXIMATE: 0.5
};

function googleObjToLocation (location) {
  var lat, lon, radius;

  if (!isEmpty(location.geometry)) {
    lat = location.geometry.location.lat;
    lon = location.geometry.location.lng;
    radius = locationUtil.distance(
      location.geometry.viewport.northeast.lat,
      location.geometry.viewport.northeast.lng,
      location.geometry.viewport.southwest.lat,
      location.geometry.viewport.southwest.lng
    );
  } else {
    debug("No geometry found. Skipping ... %j", location);
    return;
  }

  radius *= (1 / (googleConfidenceLookup[location.geometry.location_type] || 1));

  var addressComponents = formatAddress(location["address_components"]);
  debug("%j formatted to %j", location["address_components"], addressComponents);

  return Object.assign(addressComponents, {
    text: location.formatted_address,
    lat: lat,
    lon: lon,
    radius: radius
  });
}

/**
 * geocode google
 * @param {Object}  googleMapsClient  clientInstance
 * @returns {Object} objRef
 */
module.exports = function (googleMapsClient) {
  if (isEmpty(googleMapsClient)) {
    throw new Error("No client initiated");
  }

  return {
    geocode: function geocode (formattedAddress, optionalParams) {
      if (!formattedAddress) {
        throw new Error("formattedAddress/address required");
      }

      var query = Object.assign(optionalParams, {
        address: formattedAddress
      });

      return new Bluebird(function (resolve, reject) {
          googleMapsClient.geocode(query, function (err, response) {
            return !err ? resolve(response.json.results) : reject(err);
          });
        })
        .map(function (l) {
          return googleObjToLocation(l);
        })
        .filter(function (l) {
          return !isEmpty(l);
        });
    },
    reverseGeocode: function reverseGeocode (lat, lon, optionalParams) {
      if (isEmpty(lat) || isEmpty(lon)) {
        throw new Error("lan and lon are required");
      }

      var query = Object.assign(optionalParams, {
        latlng: lat + "," + lon
      });

      return new Bluebird(function (resolve, reject) {
          googleMapsClient.geocode(query, function (err, response) {
            return !err ? resolve(response.json.results) : reject(err);
          });
        })
        .map(function (l) {
          return googleObjToLocation(l);
        })
        .filter(function (l) {
          return !isEmpty(l);
        });
    }
  };
};
