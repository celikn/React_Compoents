
const convertDMSToDD = (degrees, minutes, seconds, direction) => {
  var dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);
  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  }
  return parseFloat(dd).toPrecision(8);
}

//Source: https://stackoverflow.com/questions/5786025/decimal-degrees-to-degrees-minutes-and-seconds-in-javascript
function truncate(n) {
  return n > 0 ? Math.floor(n) : Math.ceil(n);
}

function convertDDToDMS(dd, longOrLat) {
  let hemisphere = /^[WE]|(?:lon)/i.test(longOrLat)
    ? dd < 0
      ? "W"
      : "E"
    : dd < 0
      ? "S"
      : "N";

  const absDD = Math.abs(dd);
  const degrees = truncate(absDD);
  const minutes = truncate((absDD - degrees) * 60);
  const seconds = ((absDD - degrees - minutes / 60) * Math.pow(60, 2)).toFixed(3);
  return { dir: hemisphere, deg: degrees, min: minutes, sec: seconds };
}

const parseJwt = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

const round = (number, precision = 0) => {
  return (
    Math.round(number * Math.pow(10, precision) + Number.EPSILON) /
    Math.pow(10, precision)
  );
}

const findUTMZone= (Lon) => {
  zoneNumber = Math.floor((Lon + 180) / 6) + 1;
  return zoneNumber;
}
export {convertDMSToDD, convertDDToDMS, parseJwt, round, findUTMZone}
