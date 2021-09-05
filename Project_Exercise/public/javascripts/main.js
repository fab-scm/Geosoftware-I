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
 addSightsFromDB(sights);

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
 
 if (window.location.pathname == "/edit") {
     // adds the draw control to the map
     map.addControl(drawControl);
 }