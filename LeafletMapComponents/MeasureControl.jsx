
import { useEffect } from "react";
import L from "leaflet";

// Localization için tr versiyonunu ekliyoruz. 
import 'leaflet-measure/dist/leaflet-measure.tr.js';
import 'leaflet-measure/dist/leaflet-measure.css';


const addLeafletMeasureControl = (map) =>{
  let measureControl = new L.Control.Measure({
      activeColor: '#7ee6dd',
      completedColor: '#22209e',
      position: 'topright',
      lineColor: 'blue',
      primaryLengthUnit:"meters",
      secondaryLengthUnit:"kilometers",
      primaryAreaUnit:"sqmeters",
      secondaryAreaUnit:undefined,
      localization: 'tr',
      decPoint :".",
      thousandsSep: " ",
      units: { 
		meters: {
			factor: 1,
			display: 'meters',
			decimals: 2
		},
		sqmeters: {
			factor: 1,
			display: 'sqmeters',
			decimals: 2
		}
	}

      });
      measureControl.addTo(map);
  }


const MeasureControl = ({map}) => { 

    useEffect(() => {
        if (!map) return;
    
        addLeafletMeasureControl(map)
    
      }, [map]);
    
  
    return null;

}
  
  export default MeasureControl;
