import React, { useCallback, useEffect, useMemo, useState,useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardBody, CardHeader, CardGroup, Row, Container } from 'reactstrap'
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import '~/../src/scss/_custom.scss'
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import { BingLayer } from 'react-leaflet-bing-v2' 
import { round } from '~/utils/helperFunctions'

import {
  Circle,
  FeatureGroup,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  ScaleControl,
} from 'react-leaflet'

import MouseCoordinates from '~/components/leafletMapComponents/MouseCoordinates';
import ZoomToExtent from '~/components/leafletMapComponents/ZoomToExtent';
import LeafletGeoCoder from  '~/components/leafletMapComponents/LeafletGeoCoder';
import MeasureControl from '~/components/leafletMapComponents/MeasureControl';
import SelectByAttribute from '~/components/leafletMapComponents/SelectByAttribute';
import LeafletFileLoad from '~/components/leafletMapComponents/LeafletFileLoad';
import LeafletLayerControlExtension from '~/components/leafletMapComponents/LeafletLayerControlExtension';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;



const center = [39, 39]
const rectangle = [
  [36.0, 36.93],
  [38, 37.939],
]
const zoom = 13
 
import icons8_select_50_OKT from '~/assets/map-icons/icons8-select-50_OKT_K.png'; 
import icons8_select_50_OKT_T from '~/assets/map-icons/icons8-select-50_OKT_T.png'; 
import icons8_select_50_OKT_M from '~/assets/map-icons/icons8-select-50_OKT_M.png'; 

const customMarkerBirinciAsama = new L.icon({
  iconUrl: icons8_select_50_OKT,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, 0],
  shadowSize: [20, 20]

});


var customMarkerIkinciAsama = new L.Icon({
  iconUrl: icons8_select_50_OKT_T,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, 0],
  shadowSize: [20, 20]
});



var customMarkerSonAsama = new L.Icon({
  iconUrl: icons8_select_50_OKT_M,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, 0],
  shadowSize: [20, 20]
});


const bingMapsKey = "Key"
const bingMapUrl = "https://www.bing.com/api/maps/mapcontrol?key=" + bingMapsKey;


const MainMap = () => {



  ///....not included code here....
  
  // whenCreated parametresi ile map elementini dışarı almak için kullanılıyor. 
  const [map, setMap] = useState(null)
  const popupElRef = useRef(null);
  const layerControlRef =useRef(null);


  // // This create reset button 
  // function DisplayPosition({ map }) {
  //   const [position, setPosition] = useState(map.getCenter())

  //   const onClick = useCallback(() => {
  //     map.setView(center, zoom)
  //   }, [map])

  //   const onMove = useCallback(() => {
  //     setPosition(map.getCenter())
  //   }, [map])

  //   useEffect(() => {
  //     map.on('move', onMove)
  //     return () => {
  //       map.off('move', onMove)
  //     }
  //   }, [map, onMove])

  //   return (
  //     <>
  //       <p>latitude: {position.lat.toFixed(6)}</p>
  //       <p>longitude: {position.lng.toFixed(6)}</p>
  //       <p><button onClick={onClick}>reset</button></p>
  //     </>

  //   )
  // }

  const oktKuyuFeatureGroup = useMemo(() => (
    <LayersControl.Overlay checked name="OKT Lokasyonları">
      <FeatureGroup>
        {lktKuyulari.map((kuyu) => (
          <Marker title={"OKT Lokasyonları"}
            key={kuyu.id}
            properties={kuyu}
            position={[kuyu.kuyuKoordinatlari[0].wgS84Longitude, kuyu.kuyuKoordinatlari[0].wgS84Latitude]}
            icon={customMarkerBirinciAsama}
            eventHandlers={{
              // click: (e) => {
              //   console.log('marker clicked', lktKuyu.kuyuAdi)
              // },
              mouseover:(e) => {
                e.target.openPopup();
              },
              mouseout:(e) => {
                e.target.closePopup();
              }

            }}
          >
            {/* <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>{lktKuyu.kuyuAdi}</Tooltip> */}
            <Popup ref={popupElRef} closeButton={true}>
              <table>
                 <tr ><b>{"Kuyu Adı:"}</b> {kuyu.kuyuAdi}</tr>
                 <tr ><b>{"Kuyu Kimlik Numarası:"}</b> {kuyu.kuyuKimlikNumarasi}</tr>
                 <tr ><b>{"Yılı:"}</b> {kuyu.yil}</tr>
                 <tr ><b>{"Tutanak Türü:"}</b> {"OKT"}</tr>
                 <tr ><b>{"Enlem (EPSG:4326):"}</b> {round(Math.abs(kuyu.kuyuKoordinatlari[0].wgS84Latitude),6).toFixed(6)}</tr>
                 <tr ><b>{"Boylam (EPSG:4326):"}</b> {round(Math.abs(kuyu.kuyuKoordinatlari[0].wgS84Longitude),6).toFixed(6)}</tr>
              </table>
           </Popup>
          </Marker>
        ))}
      </FeatureGroup>

    </LayersControl.Overlay>),
    [lktKuyulari],
  )


  const lktKuyuFeatureGroup = useMemo(() => (
    <LayersControl.Overlay checked name="LKT Lokasyonları">
      <FeatureGroup>
        {lttKuyulari.map((kuyu) => (
          <Marker title={"LKT Lokasyonları"}
            key={kuyu.id}
            properties={kuyu}
            position={[kuyu.kuyuKoordinatlari[1].wgS84Longitude, kuyu.kuyuKoordinatlari[1].wgS84Latitude]}
            icon={customMarkerIkinciAsama}
            eventHandlers={{
              // click: (e) => {
              //   console.log('marker clicked', lktKuyu.kuyuAdi)
              // },
              mouseover:(e) => {
                e.target.openPopup();
              },
              mouseout:(e) => {
                e.target.closePopup();
              }

            }}
          >
            {/* <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>{lktKuyu.kuyuAdi}</Tooltip> */}
            <Popup ref={popupElRef} closeButton={true}>
              <table>
                 <tr ><b>{"Kuyu Adı:"}</b> {kuyu.kuyuAdi}</tr>
                 <tr ><b>{"Kuyu Kimlik Numarası:"}</b> {kuyu.kuyuKimlikNumarasi}</tr>
                 <tr ><b>{"Yılı:"}</b> {kuyu.yil}</tr>
                 <tr ><b>{"Tutanak Türü:"}</b> {"LKT"}</tr>
                 <tr ><b>{"Enlem(EPSG:4326):"}</b> {round(Math.abs(kuyu.kuyuKoordinatlari[1].wgS84Latitude),6).toFixed(6)}</tr>
                 <tr ><b>{"Boylam(EPSG:4326):"}</b> {round(Math.abs(kuyu.kuyuKoordinatlari[1].wgS84Longitude),6).toFixed(6)}</tr>

              </table>
           </Popup>
          </Marker>
        ))}
      </FeatureGroup>

    </LayersControl.Overlay>),
    [lttKuyulari],
  )

  const lttKuyuFeatureGroup = useMemo(() => (
    <LayersControl.Overlay checked name="LTT Lokasyonları">
      <FeatureGroup>
        {sonAsamaTamamKuyular.map((kuyu) => (
          <Marker title={"LTT Lokasyonları"}
            key={kuyu.id}
            position={[kuyu.kuyuKoordinatlari[2].wgS84Longitude, kuyu.kuyuKoordinatlari[2].wgS84Latitude]}
            icon={customMarkerSonAsama}
            properties={kuyu}
            eventHandlers={{
              // click: (e) => {
              //   console.log('marker clicked', lktKuyu.kuyuAdi)
              // },
              mouseover:(e) => {
                e.target.openPopup();
              },
              mouseout:(e) => {
                e.target.closePopup();
              }

            }}
          >
            {/* <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>{lktKuyu.kuyuAdi}</Tooltip> */}
            <Popup ref={popupElRef} closeButton={true}>
              <table>
                 <tr ><b>{"Kuyu Adı:"}</b> {kuyu.kuyuAdi}</tr>
                 <tr ><b>{"Kuyu Kimlik Numarası:"}</b> {kuyu.kuyuKimlikNumarasi}</tr>
                 <tr ><b>{"Yılı:"}</b> {kuyu.yil}</tr>
                 <tr ><b>{"Tutanak Türü:"}</b> {"LTT"}</tr>
                 <tr ><b>{"Boylam (EPSG:4326):"}</b> {round(Math.abs(kuyu.kuyuKoordinatlari[2].wgS84Longitude),6).toFixed(6)}</tr>
                 <tr ><b>{"Enlem (EPSG:4326):"}</b> {round(Math.abs(kuyu.kuyuKoordinatlari[2].wgS84Latitude),6).toFixed(6)}</tr>
              </table>
           </Popup>
          </Marker>
        ))}
      </FeatureGroup>

    </LayersControl.Overlay>),
    [sonAsamaTamamKuyular],
  )



  return (
    <Card>
      <Container className="d-flex">
        {/* {map ? <DisplayPosition map={map} /> : null} */}
        {map ? <ZoomToExtent map={map} /> : null}
        {map ? <LeafletGeoCoder  map={map} bingKey={bingMapsKey}/> : null}
        {map ? <MeasureControl  map={map} /> : null}
        {map ? <LeafletFileLoad map={map} layerControlRef={layerControlRef} /> : null}

        {map ? <LeafletLayerControlExtension map={map} layerControlRef={layerControlRef} /> : null}



        <MapContainer center={center} zoom={12} scrollWheelZoom={true} whenCreated={setMap} maxZoom={30} >


          <LayersControl position="topright" ref={layerControlRef}>
            <LayersControl.BaseLayer name="OpenStreet Map">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            
            <LayersControl.BaseLayer name="Google Map">
              <TileLayer
                url='http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}'
                maxZoom={30}
                subdomains={['mt1', 'mt2', 'mt3']}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer checked name='Bing Maps'>
              <BingLayer  bingkey={bingMapsKey} type="AerialWithLabels" />
            </LayersControl.BaseLayer>
              {oktKuyuFeatureGroup}
              {lktKuyuFeatureGroup}
              {lttKuyuFeatureGroup}

            {/* 
        <LayersControl.Overlay name="Marker with popup">
          <Marker position={center}>
            <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>{"Deneme"}</Tooltip>
          </Marker>

        </LayersControl.Overlay> */}

            {/* <LayersControl.Overlay checked name="Layer group with circles">
          <LayerGroup>
            <Circle
              center={center}
              pathOptions={{ fillColor: 'blue' }}
              radius={200}
            />
            <Circle
              center={center}
              pathOptions={{ fillColor: 'red' }}
              radius={100}
              stroke={false}
            />
            <LayerGroup>
              <Circle
                center={[51.51, -0.08]}
                pathOptions={{ color: 'green', fillColor: 'green' }}
                radius={100}
              />
            </LayerGroup>


          </LayerGroup>
        </LayersControl.Overlay> */}


            {/* 
        <LayersControl.Overlay name="Feature group">
          <FeatureGroup pathOptions={{ color: 'purple' }}>
            <Popup>Popup in FeatureGroup</Popup>
            <Circle center={[36, 36]} radius={200} />
            <Rectangle bounds={rectangle} />
          </FeatureGroup>
        </LayersControl.Overlay> */}
          </LayersControl>
          <ScaleControl imperial={false} />

          <div className="leaflet-bottom leaflet-right">
            <MouseCoordinates />
          </div>
        </MapContainer>
        {/* {map ? <SelectByAttribute map={map} layerControlRef={layerControlRef} /> : null} */}

      </Container>
    </Card>

  )
}


export default MainMap;
