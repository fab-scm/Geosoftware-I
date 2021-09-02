/**
 * Main script that calls the function, which provides the map divison with necessary data
 * @author Fabian Schumacher
 * @since 4.0.1
 */

 "use strict"

 // get a first map into the HTML-document and store the map object in the variable
 var map = createMap();
 
 // get the tilelayer for the map and store it into a variable
 var osmLayer = addOSMTileLayer(map);
 var mapboxLayer = addMapboxTileLayer(map);
 
 // Variable for the items drawn with the leaflet tool. Uses a feature group to store the editable layers
 var drawnItems = new L.FeatureGroup();
 
 // FeatureGroup to store the markers
 let markers = new L.FeatureGroup();

 // Load all sights from MongoDB 
 addSights(sights);

 // New draw control for the given map, in which only the reactangle tool is provided
 var drawControl = new L.Control.Draw({
     draw: {
         rectangle: false,
         polyline: false,
         circle: false,
         circlemarker: false
     },
 });
 
 // adds the layer with drawn items to the map
 map.addLayer(drawnItems);
 
 
 //Variables used for handling the layer control
 var baseMap = { "OSM": osmLayer,
                 "Mapbox": mapboxLayer};
 
 // adds the layer control to the map
 L.control.layers(baseMap).addTo(map);
 
 // the function gets called every time the event (new reactangnle drawn) happens
 map.on('draw:created', function(event) {
     console.log(event)
     var tempMarker = event.layer.addTo(map);
     //drawnItems.addLayer(tempMarker);
     var popupContent =      '<div class="col-sm-4">Name<input class="form-control" id="name" type="text" name="name" /></div>' +
                             '<div class="col-sm-4">URL<input class="form-control" id="url" type="text" name="url" /></div>' +
                             '<div class="col-sm-4">Beschreibung<input class="form-control" id="beschreibung" type="text" name="beschreibung" /></div>' +
                             '</div><button id="send" class="btn btn-primary mb-2" type="submit">Send</button>';
 
                         /*'<form action="/edit/addSight" method="post">' +
                             '<fieldset>' +
                                 '<div class="form-group row"><label class="col-sm-1 col-form-label" for="poiname">Name</label>' +
                                     '<div class="col-sm-4"><input class="form-control" id="name" type="text" name="name" /></div>' +
                                 '</div>' +
                                 '<div class="form-group row"><label class="col-sm-1 col-form-label" for="cityname">URL</label>' +
                                     '<div class="col-sm-4"><input class="form-control" id="url" type="text" name="url" /></div>' +
                                 '</div>' + 
                                 '<div class="form-group row"><label class="col-sm-1 col-form-label" for="picturelink">Beschreibung</label>' +
                                     '<div class="col-sm-4"><input class="form-control" id="beschreibung" type="text" name="beschreibung" /></div>' +
                                 '</div><button class="btn btn-primary mb-2" type="submit">Send</button>' +
                             '</fieldset>' +
                         '</form>';*/
     
                         /*'<form id="form" enctype="multipart/form-data" class = "form-horizontal" method="post" action="/edit/addSight">'+
                             '<div class="form-group">'+
                                 '<label class="label col-sm-5"><strong>Name: </strong></label>'+
                                 '<input type="text" class="form" rows="1" id="name" name="name"></input>'+
                             '</div>'+
                             '<div class="form-group">'+
                                 '<label class="label col-sm-5"><strong>URL: </strong></label>'+
                                 '<input type="text" class="form" rows="1" id="url" name="url"></input>'+
                             '</div>'+
                             '<div class="form-group">'+
                                 '<label class="label col-sm-5"><strong>Beschreibung: </strong></label>'+
                                 '<input type="text" class="form" rows="3" id="beschreibung" name="beschreibung"></input>'+
                             '</div>'+
                             '<div class="form-group">'+
                                 '<div style="text-align:center;" class="col-xs-4 col-xs-offset-2"><button type="button" class="btn btn-light">Abbrechen</button></div>'+
                                 '<div style="text-align:center;" class="col-xs-4"><button type="submit" class="btn btn-outline-success trigger-submit">Speichern</button></div>'+
                                 '<div style="text-align:center;" class="col-xs-4"><button type="submit" value="submit" class="btn btn-outline-danger trigger-submit">Löschen</button></div>'+
                             '</div>'+
                         '</form>';*/
     tempMarker.bindPopup(popupContent,{
         keepInView: false,
         closeButton: true
     }).openPopup();
     
     map.on('click', function(e){
         tempMarker.remove();
     })
     console.log(tempMarker);
     console.log(event.layerType);
 
 
     let button = document.getElementById("send");
 
     button.addEventListener('click', function(){
         var name = document.getElementById("name").value;
         var url = document.getElementById("url").value;
         var beschreibung = document.getElementById("beschreibung").value;
         var lat = event.layer._latlng.lat;
         var lng = event.layer._latlng.lng;
         var type = event.layerType;
 
         let objectDataString = createGeoJSONString(name, url, beschreibung, lat, lng, type);
         console.log(objectDataString);
 
         $.ajax({
             type: "POST",
             url: "/edit/addSight",
             //dataType: "json",
             data: {
                 o: objectDataString
             },
             success: function (data) {
                window.location.href = "/edit";
             },
             error: function () {
                 alert('error')
             }
         })
         .done(/**/)
     })
 
     /*function updateDatabase() {
         var name = document.getElementById("name").value;
         var url = document.getElementById("url").value;
         var beschreibung = document.getElementById("beschreibung").value;
         var lat = event.layer._latlng.lat;
         var lng = event.layer._latlng.lng;
         var type = event.layerType;
     
         console.log(lat);
         console.log(lng);
         console.log(type);
         let entryDB = createGeoJSON(name, url, beschreibung, lat, lng);
         console.log(entryDB);
     }*/
 
 
  })
 
 
  
 
 //updateDatabase();
 
 if (window.location.pathname == "/edit") {
     // adds the draw control to the map
     map.addControl(drawControl);
     console.log(sights);
     //addSights(sights);
     //let sightsGeoJSON = JSON.parse(sights);
     //console.log(sightsGeoJSON);
 }

 function addSights(sights) {
     deleteCurrentMarkers();
     for (let i = 0; i <sights.length; i++) {
         if (sights[i].features[0].geometry.type == "Point") {
             var marker = L.marker([sights[i].features[0].geometry.coordinates[1], sights[i].features[0].geometry.coordinates[0]]);
             marker.bindPopup(  `<h5>Infos</h5>
                        <p>Name: ${sights[i].features[0].properties.Name}</p>
                        <p>Beschreibung: ${sights[i].features[0].properties.Beschreibung}</p>
                        <p>URL: <a href="${sights[i].features[0].properties.URL}">${sights[i].features[0].properties.URL}</a></p> `)
             markers.addLayer(marker);
         }

     }
     map.addLayer(markers);
 }
 

 function deleteCurrentMarkers() {
    map.removeLayer(markers);
    markers = new L.FeatureGroup();
}
 
 
 function createGeoJSONString(name, url, beschreibung, lat, lng, type) {
     if (type == "marker") {
         let geoJSON =`{
             "type": "FeatureCollection",
             "features": [
             {
                 "type": "Feature", 
                 "properties": {
                     "Name": "${name}",
                     "URL": "${url}",
                     "Beschreibung": "${beschreibung}"
                 },
                 "geometry": {
                     "type": "Point",
                     "coordinates": 
                         [${lng}, ${lat}]
                 }
             }]
         }`
         return geoJSON;
     }
     else {
         let geoJSON = `{
             "type": "FeatureCollection",
             "features": [
             {
                 "type": "Feature", 
                 "properties": {
                     "Name": "${name}",
                     "URL": "${url}",
                     "Beschreibung": "${beschreibung}"
                 },
                 "geometry": {
                     "type": ${type},
                     "coordinates": 
                         [${lng}, ${lat}]
                 }
             }]
         }`
         return geoJSON;
     }
 }