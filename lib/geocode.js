var Bluebird = require("bluebird");
var Debug = require("debug");
var isEmpty = require("lib/util/is_empty");
var locationUtil = require("lib/util/location");

var debug = new Debug("googleClient:geocode");

var googleConfidenceLookup = {
  ROOFTOP: 1,
  RANGE_INTERPOLATED: 0.9,
  GEOMETRIC_CENTER: 0.7,
  APPROXIMATE: 0.5
};

function formatResult (addressComponents) {
  var formattedObj = {};

  for (var i = 0; i < addressComponents.length; i++) {
    var addressType = addressComponents[i].types[0];

    switch (addressType) {
      //Country
      case "country":
        formattedObj.country = addressComponents[i].long_name;
        formattedObj.countryCode = addressComponents[i].short_name;
        break;
        //Administrative Level 1
      case "administrative_area_level_1":
        formattedObj.administrativeLevel1long = addressComponents[i].long_name;
        formattedObj.administrativeLevel1short = addressComponents[i].short_name;
        break;
        //Administrative Level 2
      case "administrative_area_level_2":
        formattedObj.administrativeLevel2long = addressComponents[i].long_name;
        formattedObj.administrativeLevel2short = addressComponents[i].short_name;
        break;
        //Administrative Level 3
      case "administrative_area_level_3":
        formattedObj.administrativeLevel3long = addressComponents[i].long_name;
        formattedObj.administrativeLevel3short = addressComponents[i].short_name;
        break;
        //Administrative Level 4
      case "administrative_area_level_4":
        formattedObj.administrativeLevel4long = addressComponents[i].long_name;
        formattedObj.administrativeLevel4short = addressComponents[i].short_name;
        break;
        //Administrative Level 5
      case "administrative_area_level_5":
        formattedObj.administrativeLevel5long = addressComponents[i].long_name;
        formattedObj.administrativeLevel5short = addressComponents[i].short_name;
        break;
        // City
      case "locality":
        formattedObj.city = addressComponents[i].long_name;
        break;
        // Address
      case "postal_code":
        formattedObj.postalCode = addressComponents[i].long_name;
        break;
      case "route":
        formattedObj.streetName = addressComponents[i].long_name;
        break;
      case "street_number":
        formattedObj.streetNumber = addressComponents[i].long_name;
        break;
      case "premise":
        formattedObj.premise = addressComponents[i].long_name;
        break;
      case "subpremise":
        formattedObj.subpremise = addressComponents[i].long_name;
        break;
      case "establishment":
        formattedObj.establishment = addressComponents[i].long_name;
        break;
      case "sublocality_level_1":
      case "political":
      case "sublocality":
      case "neighborhood":
        if (!formattedObj.neighborhood) {
          formattedObj.neighborhood = addressComponents[i].long_name;
        }
        break;
    }
  }
  return formattedObj;
}

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
    return;
  }

  radius *= (1 / (googleConfidenceLookup[location.geometry.location_type] || 1));

  var addressComponents = formatResult(location["address_components"]);
  return Object.assign(addressComponents, {
    text: location.formatted_address,
    lat: lat,
    lon: lon,
    radius: radius
  });
}


/**
 * geocode google
 * @param {String}  googleMapsClient  googleMapClient object
 * @param {String}  formattedAddress  address
 * @param {Object}  optionalParams    search optional params
 * @param {Object}  otherOpts  extra params
 * @returns {Object} opencageGeocoder response
 */
 exports.geocode = function (googleMapsClient, formattedAddress, optionalParams) {
   if (isEmpty(googleMapsClient)) {
     throw new Error("No client initiated");
   }
   if (!formattedAddress) {
     throw new Error("formattedAddress/address required");
   }

   var query = Object.assign({
     address: formattedAddress
   }, optionalParams);

   var googleGeocode = Bluebird.promisify(googleMapsClient.geocode);
   return googleGeocode(query)
     .then(function (result) {
       return result.json.results;
     })
     .map(function (l) {
       return googleObjToLocation(l);
     })
     .filter(function (l) {
       return !isEmpty(l);
     });
 };
