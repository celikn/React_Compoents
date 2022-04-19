import { useEffect } from "react";
import L from "leaflet";

import  'leaflet-control-geocoder/dist/Control.Geocoder.css';
import  'leaflet-control-geocoder/dist/Control.Geocoder.js';
import ToGeojson from 'togeojson'
import FileLayer from 'leaflet-filelayer'

FileLayer(null, L, ToGeojson);
L.Control.FileLayerLoad.LABEL = '<i class="fa fa-folder-open"></i>';

const layerGroup = L.layerGroup();
const LeafletFileLoad = ({map,layerControlRef}) => { 

function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
    };

    var style = {
        color:  getRandomColor() ,
        opacity: 1.0,
        fillOpacity: 1.0,
        weight: 1,
        radius: 5,
        clickable: true,
        fillColor: getRandomColor(),
  
      };
  


  useEffect(() => {
    if (!map) return;


    // DefultMarkGeocode false olduğunda zoom yapmaması sorunu : https://github.com/perliedman/leaflet-control-geocoder/issues/230
    var layer = L.Control.fileLayerLoad({
        fitBounds: true,
        formats: [
              '.geojson',
              '.kml',
              '.json'
          ],
        fileSizeLimit: 10240000000,
        layerOptions: {
          style: style,
          onEachFeature: onEachFeature,
          pointToLayer: function (data, latlng) {
            return L.circleMarker(
              latlng, {
              style: style
            }
            );
          }
        }
      }).addTo(map);
  
  
      //Changes color
      layer.loader.on('data:loaded', function (e) {
        style.color = getRandomColor(); // change to cycle/random colors
        style.fillColor=getRandomColor(); // change to cycle/random colors
      });
  
     //add to overlay   
      layer.loader.on('data:loaded', function (e) {
        

        // layerControlRef.current.addOverlay(layerGroup , "Kullanıcı Katmanları");
        // layerGroup.addLayer(e.layer,e.filename)
        layerControlRef.current.addOverlay(e.layer, e.filename);
    });

    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.Name) {
          //layer.bindPopup(feature.properties.popupContent);
          layer.bindPopup(feature.properties.Name);
        }
        else if (feature.properties && feature.properties.name) {
          //layer.bindPopup(feature.properties.popupContent);
          layer.bindPopup(feature.properties.name);
        }
        else if (feature.properties && feature.properties.popupContent) {
          layer.bindPopup(feature.properties.popupContent);
        }
      }
  
  
  }, [map]);

  return null;
}

export default LeafletFileLoad;
