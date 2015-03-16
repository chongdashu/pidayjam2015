var isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

function generateHexColor() { 
    return '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16);
};