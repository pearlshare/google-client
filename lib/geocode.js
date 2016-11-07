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
  var lat, lon, radius, bounds;

  if (!isEmpty(location.geometry)) {
    lat = location.geometry.location.lat;
    lon = location.geometry.location.lng;
    bounds = [
      location.geometry.viewport.northeast.lat,
      location.geometry.viewport.northeast.lng,
      location.geometry.viewport.southwest.lat,
      location.geometry.viewport.southwest.lng
    ];
    radius = locationUtil.distance.apply(this, bounds);
  } else {
    debug("No geometry found. Skipping ... %j", location);
    return;
  }

  var components = formatAddress(location["address_components"]);
  debug("%j formatted to %j", location["address_components"], components);

  return {
    components: components,
    formattedText: location.formatted_address,
    location: {
      lat: lat,
      lon: lon
    },
    viewport: {
      bounds: bounds,
      radius: radius
    },
    confidence: googleConfidenceLookup[location.geometry.location_type]
  };
}


function formatResponse (results) {
  if (results) {
    return results
      .map(function (l) {
        return googleObjToLocation(l);
      })
      .filter(function (l) {
        return !isEmpty(l);
      });
  }
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

  var googleGeocoder = Bluebird.promisify(googleMapsClient.geocode);

  return {
    geocode: function geocode (formattedAddress, optionalParams) {
      if (!formattedAddress) {
        throw new Error("formattedAddress/address required");
      }

      var query = Object.assign(optionalParams, {
        address: formattedAddress
      });

      return googleGeocoder(query)
        .then(function (response) {
          return formatResponse(response.json.results);
        });
    },
    reverseGeocode: function reverseGeocode (lat, lon, optionalParams) {
      if (isEmpty(lat) || isEmpty(lon)) {
        throw new Error("lan and lon are required");
      }

      var query = Object.assign(optionalParams, {
        latlng: lat + "," + lon
      });

      return googleGeocoder(query)
        .then(function (response) {
          return formatResponse(response.json.results);
        });
    }
  };
};
