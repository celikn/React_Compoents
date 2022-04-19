
import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import PropTypes from "prop-types";
import L from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
//Modified Source: https://medium.com/trabe/creating-a-react-leaflet-custom-component-using-hooks-5b5b905d5a01
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { round } from '~/utils/helperFunctions'
import $ from 'jquery'


let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;
import icons8_select_50_Target from '~/assets/map-icons/icons8-target-64.png'; 


const SelectByAttribute = ({map,layerControlRef}) => {
  console.log(layerControlRef);


  const katmanListesi=["OKT Lokasyonları","LKT Lokasyonları","LTT Lokasyonları","Tüm Lokasyonlar"]

  const [visible, setVisible] = React.useState(false);
  const [disable, setDisable] = React.useState(false);

  const [selectByAttributeClicked, setSelectByAttributeClicked] = React.useState(false);
  const [layerNameList, setLayerNameList] = React.useState([]);
  const [layerAttributeList, setLayerAttributeList] = React.useState([]); // tüm marker layer bilgileri
  const [selectedLayerAttributeList, setSelectedLayerAttributeList] = React.useState([]);  // kullanıcı seçimine filtrelenmiş layer bilgileri 
  const [selectedLayer, setSelectedLayer] = React.useState(); // kullanıcı seçimine layer tipi
  const [selectedLayerAttributes, setSelectedLayerAttributes] = React.useState([]);  // Sadece attribute keys 
  const [selectedLayerAttribute, setSelectedLayerAttribute] = React.useState();  //  kullanıcı seçimi key
  const [selectedLayerUniqueAttributesValues, setSelectedLayerUniqueAttributesValues] = React.useState();
  const [selectedLayerUniqueValue, setselectedLayerUniqueValue] = React.useState();



  const handleLayerChange = (selVal) => {
    setSelectedLayer(selVal.value) // kullanıcı tarafından seçilen katman tipini set ediyor.
    // Seçilen katman tipine göre markerları filtreliyoruz.
    var selectedLayerAttributeListKeyVals=null;
    if (selVal.value !== katmanListesi[3]) {
     selectedLayerAttributeListKeyVals = layerAttributeList.filter(
        (layer) => layer.layerTitle == selVal.value
      );
    }else{
      selectedLayerAttributeListKeyVals=layerAttributeList;
    }

    setSelectedLayerAttributeList(selectedLayerAttributeListKeyVals)   // Seçime göre filtrelenmiş katman değerleri listesi.

    if (selectedLayerAttributeListKeyVals.length!= 0) {
      var layerKeys = Object.keys(selectedLayerAttributeListKeyVals[0])
      setSelectedLayerAttributes(layerKeys)  // Seçimi yapılan katmandaki keyleri diğer dropdownda olabilmesi için set ediyoruz. 
    }
    // handle error

  }


  const handleAttributeChange= (selVal)=>{

    setSelectedLayerAttribute(selVal.value)  // kullanıcı tarafından seçilen attribute
    // seçilen attribute'a ait değerlere sahip maker değerlerini alıyoruz.
    const selectedAttributeVals = selectedLayerAttributeList.map(
      (layer) =>{ return layer[selVal.value]}
    );

    var uniqueAttributeValues = Array.from(new Set(selectedAttributeVals));     // Unique yaparak diğer drop downda kullanabilmek için set ediyoruz.
    setSelectedLayerUniqueAttributesValues(uniqueAttributeValues);
  }

  const handleAttributeValChange= (selVal)=>{
    setselectedLayerUniqueValue(selVal.value) //kullanıcı tarafından seçilen value
  }


  // Filtre daha önce yapılmış ise katman adında filtre geçen katmanları haritadan ve control den kaldırıyoruz
  const removeFilterMarkers = ()=> {
    map.eachLayer(function (layer) {
      if (layer instanceof L.FeatureGroup) {
        var markerArray = layer.getLayers().filter(layer => {
          console.log(layer);
          return layer.options.title.includes("Filtre:")
        })
        console.log(markerArray)
        if (markerArray.length != 0) {
          map.removeLayer(layer)
          layerControlRef.current.removeLayer(layer)
        }
      }
    });

  }


  const clearAllStates = ()=>{

  setLayerNameList([]);
  setSelectedLayerAttributeList([])
  setSelectedLayer(null);
  setSelectedLayerAttributeList([])
  setSelectedLayerAttribute(null)
  setSelectedLayerUniqueAttributesValues([])
  setselectedLayerUniqueValue(null);
  }

// Filtrede kullanılacak olan iconlar 
const targetIcon = new L.icon({
  iconUrl: icons8_select_50_Target,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, 0],
  shadowSize: [20, 20]

});

// Butonun dialog u toggle yapmasını sağlıyor. 
  const toggleDialog = () => {
    setVisible(!visible);
  };


  // Filtrele işlemine basıldığında 
  const toggleDialogFiltrele = (setVal) => {
    setVisible(!visible); // visibility değişir

    // console.log(selectedLayerUniqueValue);
    // console.log(selectedLayerAttribute);
    // console.log(selectedLayerAttributeList);
    // Katman listesinde seçilen 

    var coordIndex= katmanListesi.indexOf(selectedLayer)     // Popup içinden koordinat seçimini otomatik yapmak için katman listesiden kullanıcının seçtiğine ait olan index değerini alır. 

    let filteredMarkers = new L.FeatureGroup();     // Filtre edilmiş markerlar için yeni bir group layer oluşturur. 
    filteredMarkers.addTo(map); // haritaya ekler

    // Kullanıcının seçtiği markerlara ait propertilerden yeni marker objeleri oluşturur ve onları group layer a ekler.
    selectedLayerAttributeList.map((layer)=> {
      if (layer[selectedLayerAttribute]==selectedLayerUniqueValue){
        var layerVals= layer.kuyuKoordinatlari[coordIndex]
        console.log(layerVals);
        return L.marker([layerVals.wgS84Longitude,layerVals.wgS84Latitude],
          {
            title: "Filtre: " +selectedLayer+"-"+selectedLayerAttribute +"-" +selectedLayerUniqueValue, // Add a title
            opacity: 0.5,
            icon: targetIcon // here assign the markerIcon var
          } // Adjust the opacity
        ).bindPopup("<table>\
          <tr><b>Uygulanan Filtre:</b> { " + selectedLayer+"-"+selectedLayerAttribute +"-" +selectedLayerUniqueValue + "}</tr><br>\
          <tr><b>Kuyu Adı:</b>"+ layer.kuyuAdi +"</tr><br>\
          <tr><b>Kuyu Kimlik Numarası:</b>"+layer.kuyuKimlikNumarasi +"</tr><br>\
          <tr><b>Yılı:</b>"+ layer.yil+ "</tr><br>\
          <tr ><b>Enlem (EPSG:4326):</b>" + round(Math.abs(layerVals.wgS84Longitude),6).toFixed(6)+"</tr><br>\
          <tr ><b>Boylam (EPSG:4326):</b>" +round(Math.abs(layerVals.wgS84Latitude),6).toFixed(6)+"</tr><br>\
       </table>"
        ).addTo(filteredMarkers);
      }    
    })


    // ilgili group layer'ı control olarak ekler. 
    layerControlRef.current.addOverlay(filteredMarkers,  "Filtre: " +selectedLayer+"-"+selectedLayerAttribute);
    map.fitBounds(filteredMarkers.getBounds());
    map.setZoom(7);
  };



//   const handleChange = (event) => {
//     setState({
//       value: event.target.value,
//     });
//   };

//   useEffect(() => {



//   }, [disable]); 

// ilk açıldığında mevcut katmanlara ait tüm filtreleri kaldıracak ve katman bilgilerini set edecek. 
useEffect(() => {
    const filterControlElement = L.control({ position: "topleft" });
    filterControlElement.onAdd = () => {
      const buttonDiv = L.DomUtil.create("button",'selectByAttribute');
      //buttonDiv.innerHTML = "Zoom To "+ title;

      buttonDiv.addEventListener('click', function(event){

          // Varsa tüm filtre katmanları kaldırıyoruz.
          removeFilterMarkers() ;
          clearAllStates();
          //$(".leaflet-control-layers-selector[type='checkbox']").prop('checked', true);

            ///////////////////////////
            // Burada geçici olarak kullanıcıya açık katman olmadığını söylüyoruz. Katmanları otomatik açan fonksiyon hazırlanamadı.
            var acikKatmanlarTitles = []
            map.eachLayer((layer)=> {
              if (layer.options && layer.options.pane=='markerPane') {
                acikKatmanlarTitles.push(layer.options.title);
                // console.log(map.hasLayer(layer))
                return layer.options.title
               }            
            })
            var uniqueAcikKatmanlar = Array.from(new Set(acikKatmanlarTitles)); 
            
            if (uniqueAcikKatmanlar.length==0){
              alert("Filtre için açık katman bulunmamaktadır.")
            }
            //////////////////////////

            else{
              // Tümü açık değilse filtrelenebilecekler hakkında uyarı veriyor.
              if (uniqueAcikKatmanlar.length!=katmanListesi.length & uniqueAcikKatmanlar.length!=0){
                alert("Filtre için açık olan katmanlar : " +uniqueAcikKatmanlar.join(","))
              }

              var markerTitles=[]  // Mevcut markerların adlarını tutan liste
              var markerProperties=[] // Her markerın bilgilerini tutan liste 

              map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                  markerTitles.push(layer.options.title);
                  // Marker objesi oluşturup title ekleyip propery listesine ekliyor
                  var markerPropertiesObj = Object.assign({ layerTitle: layer.options.title }, layer.options.properties);
                  markerProperties.push(markerPropertiesObj);
                
                }
                // Katman adları unique yaparak 
                var uniqueMarkerTitles = Array.from(new Set(markerTitles));
                setLayerNameList(...layerNameList, uniqueMarkerTitles);  // Katman adlarını drop down içinde göstermek üzere set ediyor. 
                setLayerAttributeList(markerProperties)  // Tüm Marker propertylerini tutan listeyi set ediyor.
                console.log(markerProperties)
                setSelectByAttributeClicked(true);
                toggleDialog();
              });

            }

       });


     return buttonDiv;
    };

    filterControlElement.addTo(map);

    return () => filterControlElement.remove();
  }, [map]);  //[] makes it run only once 
  return (
    <div>
      {selectByAttributeClicked && visible && (
        <Dialog title={"Attribute değerine göre göster"} onClose={toggleDialog}>
                  <div>
                      Katman
                      <br />
                      <DropDownList
                          style={{
                              width: "300px",
                          }}
                          data={katmanListesi}
                          onChange={handleLayerChange}
                          defaultItem={"Katman seçiniz.."}


                      />
                  </div>
                  <div>
                      Öznitelik
                      <br />
                      <DropDownList
                          style={{
                              width: "300px",
                          }}
                          disabled={selectedLayerAttributes.length==0}
                          data={selectedLayerAttributes}
                          onChange={handleAttributeChange}
                          defaultItem={"Öznitelik seçiniz.."}


                      />
                  </div>
                  <div>
                      Değer
                      <br />
                      <DropDownList
                          style={{
                              width: "300px",
                          }}
                          disabled={selectedLayerUniqueAttributesValues.length==0}
                          data={selectedLayerUniqueAttributesValues}
                          onChange={handleAttributeValChange}
                          defaultItem={"Değer seçiniz.."}


                      //onChange={handleLayerAttributListChange}

                      />
                  </div>
          <p
            style={{
              margin: "25px",
              textAlign: "center",
            }}
            

          >
              

            Are you sure you want to continue?
          </p>
 

          <DialogActionsBar>
            <button
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              onClick={toggleDialog}
            >
              Vazgeç
            </button>
            <button
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              onClick={toggleDialogFiltrele}
            >
              Filtrele
            </button>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
};

export default SelectByAttribute;

