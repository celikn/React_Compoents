
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import PropTypes from "prop-types";
import L from "leaflet";
//Modified Source: https://medium.com/trabe/creating-a-react-leaflet-custom-component-using-hooks-5b5b905d5a01

const ZoomToExtent = ({map, boundsSwNe}) => {
  const title="Extent"

  useEffect(() => {
    const zoomControlElement = L.control({ position: "topleft" });

    zoomControlElement.onAdd = () => {
      const buttonDiv = L.DomUtil.create("button",'zoomToExtent');
      //buttonDiv.innerHTML = "Zoom To "+ title;

      buttonDiv.addEventListener('click', function(event){
        console.log(map.getCenter());
        console.log(map.getBounds())
        //map.setView([41, 41], 13);
        if (boundsSwNe!=undefined){
            // bounds array containing southWest and NorthEastCoordinates
            var southWest = L.latLng(boundsSwNe[0],boundsSwNe[1]),
                northEast = L.latLng(boundsSwNe[2], boundsSwNe[3]),
                bounds = L.latLngBounds(southWest, northEast);
                map.fitBounds(bounds);
        } else{
            // Default olarak TR ye odaklanacak 
            var southWest = L.latLng(35.712, 26.227),
            northEast = L.latLng(44.774, 48.125),
            bounds = L.latLngBounds(southWest, northEast);
            map.fitBounds(bounds);
        }
     });


     return buttonDiv;
    };

    zoomControlElement.addTo(map);

    return () => zoomControlElement.remove();
  }, [map]);  //[] makes it run only once 
  return null;
};

export default ZoomToExtent;

