/**
 * The script provides functions to create, manipulate and add thngs to leaflet maps
 * @author Fabian Schumacher
 * @version 4.0.1
 */
"use strict"

// Basemap options
 let osmTileLayerOptions = {
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
function addTileLayer(mapObj) {
    return new L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, osmTileLayerOptions).addTo(mapObj);
}