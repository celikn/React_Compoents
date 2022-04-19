//Source : https://angelos.dev/2021/07/mouse-coordinates-component-for-react-leaflet/
import React from 'react';
import { useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { round, convertDDToDMS } from '~/utils/helperFunctions'
import proj4 from 'proj4';

// function round(number, precision = 0) {
//   return (
//     Math.round(number * Math.pow(10, precision) + Number.EPSILON) /
//     Math.pow(10, precision)
//   );
// }

function utmzone_from_lon(lon_deg) {
  //get utm-zone from longitude degrees
  return parseInt(((lon_deg+180)/6)%60)+1;
}

function proj4_setdef(lon_deg) {
  //get UTM projection definition from longitude
  const utm_zone = utmzone_from_lon(lon_deg);
  const zdef = `+proj=utm +zone=${utm_zone} +datum=WGS84 +units=m +no_defs`;
  return zdef;
}

function getUtmCoordinates(lon_input,lat_input) {
  proj4.defs([
    [
      "EPSG:4326",
      "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"
    ],
    ["EPSG:AUTO", proj4_setdef(lon_input)]]);
  const azone = utmzone_from_lon(lon_input);
  const en_m = proj4("EPSG:4326", "EPSG:AUTO", [lon_input, lat_input]);
  const e3digits = en_m[0].toFixed(3); //easting
  const n3digits = en_m[1].toFixed(3); //northing

  return `(EPSG:326${azone}) Sağa Değer :${e3digits} m, Yukarı Değer:${n3digits} m`;
}


function formatLatitudeDMS(latitude){
  const wgs84latitudeDmsObj = convertDDToDMS(latitude,"lat");
  return wgs84latitudeDmsObj.deg +"° "+wgs84latitudeDmsObj.min +"'' "+wgs84latitudeDmsObj.sec+"'"
}

function formatLongitudeDMS(longitude){
  const wgs84longitudeDmsObj = convertDDToDMS(longitude,"long"); 
  return wgs84longitudeDmsObj.deg +"° "+wgs84longitudeDmsObj.min +"'' "+wgs84longitudeDmsObj.sec+"'"
}


function formatLatitude(latitude) {
  const direction = latitude > 0 ? 'N' : 'S';
  return `Enlem : ${round(Math.abs(latitude), 6).toFixed(6)}° ${direction} (${formatLatitudeDMS(latitude)})`;
}

function formatLongitude(longitude) {
  const direction = longitude > 0 ? 'E' : 'W';
  return `Boylam: ${round(Math.abs(longitude), 6).toFixed(6)}° ${direction} (${formatLongitudeDMS(longitude)})`;
          
}

function MouseCoordinates() {
  const [mousePoint, setMousePoint] = React.useState(null);

 

  const formattedCoordinates =
    mousePoint === null
      ? ''
      : `(EPSG:4326) ${formatLatitude(mousePoint.lat)}, ${formatLongitude(mousePoint.lng)}`;

  React.useEffect(
    function copyToClipboard() {
      function handleCtrlCKeydown(event) {
        if (
          event.key === 'c' &&
          event.ctrlKey &&
          formattedCoordinates.length > 0 &&
          navigator.clipboard
        ) {
          navigator.clipboard.writeText(formattedCoordinates);
        }
      }

      document.addEventListener('keydown', handleCtrlCKeydown);

      return function cleanup() {
        document.removeEventListener('keydown', handleCtrlCKeydown);
      };
    },
    [formattedCoordinates]
  );

  useMapEvents({
    mousemove(event) {
      setMousePoint(event.latlng);
    },
    mouseout() {
      setMousePoint(null);
    },
  });

  if (formattedCoordinates.length === 0) return null;

  return (
    <div className="enlem-boylam leaflet-control-attribution leaflet-control">
      {formattedCoordinates} <br/> 
      {getUtmCoordinates(mousePoint.lng,mousePoint.lat)}
    </div>
  );
}

export default MouseCoordinates;
