import { useEffect } from "react";
import L from "leaflet";

import  'leaflet-control-geocoder/dist/Control.Geocoder.css';
import  'leaflet-control-geocoder/dist/Control.Geocoder.js';


const LeafletGeoCoder = ({map,bingKey}) => { 

  // Bing geocoder react ile token hatası vermekte.
  const geocoderOptions = {
    position: 'topleft',
    collapsed: true,
    placeholder: 'Yerleşim Yeri arayınız...',
    defaultMarkGeocode: false,
    geocoder: L.Control.Geocoder.nominatim({
      geocodingQueryParams: {
        countrycodes: 'tr',
      }
    }),
    // geocoder: L.Control.Geocoder.bing({
    //   apiKey: bingKey
    // }),
  }

  useEffect(() => {
    if (!map) return;

    // DefultMarkGeocode false olduğunda zoom yapmaması sorunu : https://github.com/perliedman/leaflet-control-geocoder/issues/230
    L.Control.geocoder(geocoderOptions).on('markgeocode', function(e) { 
      map.setView(e.geocode.center, 11
    ); }).addTo(map);

  }, [map]);

  return null;
}

export default LeafletGeoCoder;
