/**
 * The script provides functions to create, manipulate and add thngs to leaflet maps
 * @author Fabian Schumacher
 * @version 4.0.1
 */
"use strict"

// Basemap options
 let mapboxTileLayerOptions = {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
};




// Default map options
let mapOptionsDefault = {
    drawControl: false
}


/**
 * The function creates the leaflet map with the view set to Germany with a zoom level, so that the whole country can be seen in the map window.
 * 
 * @param {String} htmlID - the HTML-id of the division in which the map is displayed
 * @param {Object} mapOptionsDefault - the default map options used for the initialization
 * @returns - the leaflet map object
 */
function createMap(htmlID = 'map', mapOptions = mapOptionsDefault) {
     return L.map(htmlID, mapOptions).setView([51.9617, 7.6252], 15);
}


/**
 * The functions adds a mapbox/openstreet tilelayer to the map with the osmTileLayerOptions
 * 
 * @param {L.Map} mapObj - the Leaflet map object stored in the variable
 * @returns - the tile layer, which will be added to map
 */
function addMapboxTileLayer(mapObj) {
    return new L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, mapboxTileLayerOptions).addTo(mapObj);
}

function addOSMTileLayer(mapObj) {
    return new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution:'&copy; <a href="http://osm.org/copyright%22%3EOpenStreetMap</a> contributors'}).addTo(mapObj);
}



function addSightsFromDB(sights) {
    //console.log(sights)
    deleteCurrentMarkers();
    for (let i = 0; i <sights.length; i++) {
        if (sights[i].features[0].geometry.type == "Point") {
           var s = L.geoJSON(sights[i], {
               coordsToLatLng: function (coords) {
                   //                    latitude , longitude, altitude
                   //return new L.LatLng(coords[1], coords[0], coords[2]); //Normal behavior
                   return new L.LatLng(coords[1], coords[0] /*coords[2]*/);
               }
           });
           //console.log(s._layers);
           var marker = L.marker([s._layers[s._leaflet_id-1]._latlng.lat, s._layers[s._leaflet_id-1]._latlng.lng]);
           marker.bindPopup(  `<h5>Infos</h5>
                       <p>Name: ${sights[i].features[0].properties.Name}</p>
                       <p>Beschreibung: ${sights[i].features[0].properties.Beschreibung}</p>
                       <p>URL: <a href="${sights[i].features[0].properties.URL}">${sights[i].features[0].properties.URL}</a></p> `)
           markers.addLayer(marker);
        }
        if (sights[i].features[0].geometry.type == "Polygon") {
           var s = L.geoJSON(sights[i], {
               coordsToLatLng: function (coords) {
                   //                    latitude , longitude, altitude
                   //return new L.LatLng(coords[1], coords[0], coords[2]); //Normal behavior
                   return new L.LatLng(coords[1], coords[0] /*coords[2]*/);
               }
           });
           //console.log(s._layers[s._leaflet_id-1]._latlngs[0]);
           var coordinatesFinished = extractCoordinatesLatLng(s._layers[s._leaflet_id-1]._latlngs[0]);
           //console.log(coordinatesFinished);
           var polygon = L.polygon(coordinatesFinished);
           polygon.bindPopup(  `<h5>Infos</h5>
                      <p>Name: ${sights[i].features[0].properties.Name}</p>
                      <p>Beschreibung: ${sights[i].features[0].properties.Beschreibung}</p>
                      <p>URL: <a href="${sights[i].features[0].properties.URL}">${sights[i].features[0].properties.URL}</a></p> `)
           markers.addLayer(polygon);
       }
    }
    map.addLayer(markers);
}



function extractCoordinatesLatLng(coords) {
    var coordinates = [];
    for (let i = 0; i < coords.length; i++) {
        var coord = [coords[i].lat, coords[i].lng];
        coordinates.push(coord);
    }
    coordinates.push([coords[0].lat, coords[0].lng]); 
    return coordinates;
}




function deleteCurrentMarkers() {
    map.removeLayer(markers);
    markers = new L.FeatureGroup();
 }