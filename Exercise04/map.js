/**
 * The script provides functions to create, manipulate and add thngs to leaflet maps
 * @author Fabian Schumacher
 * @since 4.0.1
 */

/**
 * Basemap options
 */
 let osmTileLayerOptions = {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
};

let mapOptionsDefault = {
    drawControl: false
}


/**
 * 
 * @param {*} htmlID 
 * @param {*} mapOptionsDefault 
 * @returns 
 */
function createMap(htmlID = 'map', mapOptions = mapOptionsDefault) {
     return L.map(htmlID, mapOptions).setView([51.505, 10.27], 6);
}


/**
 * 
 * @param {*} mapObj 
 * @returns 
 */
function addTileLayer(mapObj) {
    return new L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxToken, osmTileLayerOptions).addTo(mapObj);
}


/**
 * 
 * @param {*} intersctions 
 */
function addWeatherMarkersAtIntersections(intersections){
    deleteCurrentMarkers();
    for (let i = 0; i < intersections.features.length; i++) {
        addMarker(intersections, i);
    }
    map.addLayer(markers);
}


/**
 * 
 * @param {*} intersections 
 * @param {*} i 
 */
function addMarker(intersections, i){
    let coordinates = intersections.features[i].geometry.coordinates
    let coordObj = new Coordinate(coordinates[1], coordinates[0]);
    createPositionMarkers(coordObj);
}


/**
 * 
 * @param {*} coordObj 
 */
function createPositionMarkers(coordObj) {
    let marker = new L.marker([coordObj.latitude, coordObj.longitude]);
    getWeatherData(coordObj.latitude, coordObj.longitude, marker);
    markers.addLayer(marker);
}


/**
 * 
 */
function deleteCurrentMarkers(){
    map.removeLayer(markers);
    markers = new L.FeatureGroup();
    setTimeout(function deleteDrawnItems(){drawnItems.clearLayers()}, 3000);
}


/**
 * 
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} marker 
 */
function getWeatherData(latitude, longitude, marker) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${openweatherAPIKey}`,
        method: "GET"
    })
    .done(function(data){
        getReadableLocation(latitude, longitude, marker, data);
    })
    .fail(function(xhr, status, errorThrown){
        alert("error");
        console.dir(xhr)
        console.log(status)
        console.log(errorThrown)
    })
}


/**
 * 
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} marker 
 * @param {*} data 
 */
function getReadableLocation(latitude, longitude, marker, data) {
    $.ajax({
        url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`,
        method: "GET"
    })
    .done(function(location){
        createWeatherMarkerPopup(marker, data, location);
    })
    .fail(function(xhr, status, errorThrown){
        alert("error");
        console.dir(xhr)
        console.log(status)
        console.log(errorThrown)
    })
}


/**
 * 
 * @param {*} result 
 * @param {*} marker 
 */
function createWeatherMarkerPopup(marker, data, location){
    console.log(data);
    console.log(location);
    let weatherImage = new Image();
    weatherImage.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`

    marker.bindPopup(`<h1>${location.features[3].place_name}</h1>
                        <p><img src = ${weatherImage.src}></img></p>
                        <p>${data.current.weather[0].description}</p>
                        <p>${"Temperature: " + Math.round(data.current.temp) + "°C"}<br>
                        ${"Windspeed: " + data.current.wind_speed + " m/s"}<br>
                        ${"Wind direction: " + data.current.wind_deg + "°"}<br>
                        ${"Humidity: " + data.current.humidity + " %"}<br>
                        ${"Cloudiness: " + data.current.clouds + " %"}</p>`)
}