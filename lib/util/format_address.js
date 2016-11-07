module.exports = function (addressComponents) {
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
};
