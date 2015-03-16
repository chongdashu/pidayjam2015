var isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var generateHexColor = function() {
    return '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16);
};