var lt = require("location-tools");
var isNumeric = require("./is_numeric");

module.exports = {
  distance: function (lat1, lon1, lat2, lon2) {

    if (!isNumeric(lat1) || !isNumeric(lon1) || !isNumeric(lat2) || !isNumeric(lon2)) {
      return null;
    }
    var p1 = new lt.Position(lat1, lon1);
    var p2 = new lt.Position(lat2, lon2);

    return p1.getDistance(p2);
  }
};
