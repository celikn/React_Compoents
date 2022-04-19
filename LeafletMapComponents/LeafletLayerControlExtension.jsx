

import React ,{ useEffect } from "react";
import L from "leaflet";
import $ from 'jquery'

L.Control.Layers.include({
    getOverlays: function() {
      // create hash to hold all layers
      var control, layers;
      layers = {};
      control = this;
  
      // loop thru all layers in control
      control._layers.forEach(function(obj) {
        var layerName;
  
        // check if layer is an overlay
        if (obj.overlay) {
          // get name of overlay
          layerName = obj.name;
          // store whether it's present on the map or not
          return layers[layerName] = control._map.hasLayer(obj.layer);
        }
      });
  
      return layers;
    }
  });


  function changeBackground(e) {
    e.target.style.background = 'red';
    console.log()
  }


const LeafletLayerControlExtension = ({ map, layerControlRef }) => {

  const [layerList, setLayerList] = React.useState(false);

    useEffect(() => {
        if (!map) return;

     
        console.log(layerControlRef.current); 
      

      if (layerControlRef.current.collapsed != true) {

        //$('leaflet-control-container').on('mouseenter', () => {
        var alloverlays = $('.leaflet-control-layers-overlays span')
        console.log(alloverlays)
        var allLayerElements = $(".leaflet-control-layers-overlays span:not(.zoomToLayer-btn) ")
        //--------------- Her bir layer elementine zoom ve silme butonu ekleyen kısım--------------------------------
        for (var l = 0; l < allLayerElements.length; l++) {
          console.log(allLayerElements[l])
          console.log($('.leaflet-control-layers-overlays span')[l])
          var layerId = allLayerElements[l]._leaflet_id
          var layerName = allLayerElements[l].firstChild.data
          console.log(layerName)
          // //console.log($(this).find("#" + layerId).parent());
          //$('.leaflet-control-layers-overlays span').find("span").parent().append('<span title="Sil" class="fa fa-times removeLayer-btn"></span>')
          // $(this).find("#" + layerId).parent().append('<span title="Katmana Merkezle" class="fas fa-compass zoomToLayer-btn"></span>');
          // //$(this).find("#" + layerId).parent().append('<span  title="Kaydet"  class="fas fa-save save-btn"></span>');
          // //$(this).find("#" + layerId).parent().find("input").css("margin-top", "9px");
          var hasZoomToLayerClass = $('.leaflet-control-layers-overlays span:contains(' + layerName + ')').parent().find(".zoomToLayer-btn");
          console.log(hasZoomToLayerClass.length)
          if (hasZoomToLayerClass.length == 0) {
            $('.leaflet-control-layers-overlays span:contains(' + layerName + ')').parent().append('<span title="Katmana Merkezle" layer="'+layerName+'" class="zoomToLayer-btn">Button</span>')
            $('.leaflet-control-layers-overlays span:contains(' + layerName + ')').css('background-color', 'red');
          }
        }
        //-----------------------------------------------------------------------------------------------------------

        //});

      }


      $(".zoomToLayer-btn").on('click',(e)=>{
        e.preventDefault();
        console.log(e);
        var clickedLayerName =e.target.attributes.layer.nodeValue.trim();
        console.log(e.target.attributes.layer.nodeValue.trim() + " zoom talebi.");
        var allOverlays=layerControlRef.current.getOverlays()
        if (allOverlays[clickedLayerName]){

            map.eachLayer(function (layer) {
              if (layer instanceof L.FeatureGroup) {

                console.log(layer.options.title +" "+ layer.getLayers()[0].options.title)
                console.log(layer.getLayers())
                if (layer.options.title==clickedLayerName  || layer.getLayers()[0].options.title==clickedLayerName){
                  map.fitBounds(layer.getBounds());
                  // eğer tek marker varsa zoom değeri ver
                }
                // var markerArray = layer.getLayers().filter(layer => {
                //   console.log(layer);
                //   return layer.options.title.includes("Filtre:")
                // })
                // console.log(markerArray)
                // if (markerArray.length != 0) {


               // }
              }
            });
        
          
        




        }
      });
        // $(document).on('change', '.leaflet-control-layers-selector', function() {
        //   console.log($(this))
        //   $checkbox = $(this);
        //   if ($checkbox.is(':checked')) {

        //   }
        //   else {

        //   }
        // })
    

      map.on('overlayadd', function(e){
          console.log(layerControlRef.current.getOverlays());
          ovelayKeys=Object.keys(layerControlRef.current.getOverlays())
          console.log(ovelayKeys);
          setLayerList(ovelayKeys)
       })

      
      map.on('overlayremove', function(e){
        console.log(layerControlRef.current.getOverlays());
        ovelayKeys=Object.keys(layerControlRef.current.getOverlays())
        setLayerList(ovelayKeys)

     })



    }, [layerList]);


    return null;

}

export default LeafletLayerControlExtension;
