"use strict"

var busStopObj;
var turfPoints;

var haltestellenMarker = new L.FeatureGroup();
var haltestelleMarker;

var haltestelleButton = document.getElementById("haltestelleButton");
var weatherButton = document.getElementById("weatherButton");



// Icon settings
var haltestelleIcon = L.icon({
    iconUrl: 'http://localhost:3000/images/haltestelle.png',
    iconSize:     [35, 35], // size of the icon
})

// Ajax call to retrieve information about all haltestellen
$.ajax({
    url: 'https://rest.busradar.conterra.de/prod/haltestellen',
    method: "GET",
    success: function(data){
        busStopObj = data;
        var points = [];
        for (let i = 0; i < busStopObj.features.length; i++) {
            points.push(turf.point(busStopObj.features[i].geometry.coordinates));
            
        }
        //console.log(points);
        turfPoints = turf.featureCollection(points);
        console.log(turfPoints);
    },
    error: function () {
        alert('error')
    }
})
.done()


haltestelleButton.addEventListener("click", function(e) {
    //map.removeLayer(haltestelleMarker);
    var checkedSights = getCheckedSights();
    console.log(checkedSights);
    map.removeLayer(haltestellenMarker);
    haltestellenMarker = new L.FeatureGroup();
    var polygonCenter;
    var targetPoint;
    var nearest;
    if (checkedSights.sightsChecked.length == 1){
        for (let i = 0; i < sights.length; i++) {
            if (sights[i]._id == checkedSights.sightsChecked[0]){
                if (sights[i].features[0].geometry.type == "Point"){
                    targetPoint = turf.point(sights[i].features[0].geometry.coordinates);
                    console.log(targetPoint);
                    nearest = turf.nearestPoint(targetPoint, turfPoints);
                    console.log(nearest);
                }
                else{
                    console.log([[sights[i].features[0].geometry.coordinates]]);
                    var polygon = turf.polygon(sights[i].features[0].geometry.coordinates); 
                    polygonCenter = turf.centroid(polygon);
                    console.log(polygonCenter);
                    nearest = turf.nearestPoint(polygonCenter, turfPoints);
                    console.log(nearest);
                }
            }

        }
        var nearestCoordinates = nearest.geometry.coordinates;
        console.log(nearestCoordinates);
        console.log(busStopObj.features[0].geometry.coordinates);
        for (let j = 0; j < busStopObj.features.length; j++) {
            if (JSON.stringify(busStopObj.features[j].geometry.coordinates) == JSON.stringify(nearestCoordinates)) {
                var haltestelle = busStopObj.features[j];
                console.log(haltestelle);
                haltestelleMarker = L.marker([haltestelle.geometry.coordinates[1], haltestelle.geometry.coordinates[0]], {icon: haltestelleIcon});
                getWeatherData(haltestelle.geometry.coordinates[1], haltestelle.geometry.coordinates[0], haltestelleMarker, haltestelle),
                haltestellenMarker.addLayer(haltestelleMarker);
                haltestellenMarker.addTo(map);
            }
            
        }
    }
    else if (checkedSights.sightsChecked.length > 1){
        alert("Bitte nur eine Sehenswürdigkeit auswählen.")
        }
        else {
            alert("Bitte wähle eine Sehenswürdigkeit aus.")
        }
})

weatherButton.addEventListener('click', function(e) {
    if (haltestelleMarker != null){
        haltestelleMarker.openPopup();
    }
    else {
        alert('Bitte zuerst Sehenswürdigkeit auswählen und Haltestelle anzeigen lassen.');
    }
    
})





/**
  * The function iterates through all HTML-objects from type input:checkbox
  * and puts all ids of the checked boxes into one array which is stored as an js object.
  * 
  * @returns {object} the object that contains an array with the ids of all the checked boxes in the HTML-document
  */
 function getCheckedSights() {
    var obj = {};
    obj.sightsChecked=[];
    
    $("input:checkbox").each(function(){
        var $this = $(this);

        if($this.is(":checked")){
            obj.sightsChecked.push($this.attr("id"));
        }
    });
    return obj;
 }


 /**
 * The function makes an asynchronous HTTP request (ajax) to the openWeatherAPI and gets the weather
 * for the coordinates of the intersection(the marker). If the request was successfull it calls the getReadableLocation()-function
 * and provides it with the marker and the requested weatherData.
 * 
 * @param {float} latitude - latitude coordinate of the intersection
 * @param {float} longitude - longitude coordinate of the intersection
 * @param {L.Marker} marker - the marker currently "working" on
 */
function getWeatherData(latitude, longitude, marker, haltestelle) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${openweatherAPIKey}`,
        method: "GET"
    })
    .done(function(weatherData){                                        // if the request was successfull
        createWeatherMarkerPopup(marker, weatherData, haltestelle);
    })
    .fail(function(xhr, status, errorThrown){                           // if the request fails
        alert("error");
        console.dir(xhr)
        console.log(status)
        console.log(errorThrown)
    })
}


/**
 * The function creates a leaflet Popup for the marker and fills it with the weather information and
 * a readable location description.
 * 
 * @param {object} result 
 * @param {L.Marker} marker 
 */
 function createWeatherMarkerPopup(marker, weatherData, haltestelle){

    // create weather Image
    let weatherImage = new Image();
    weatherImage.src = `http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`

    // craete date-object and define the 
    let date = new Date(weatherData.current.dt*1000)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};

    // create Popup with the weather and location<s information
    marker.bindPopup(  `<h5>${haltestelle.properties.lbez}</h5>
                        <p style="text-align: center">${date.toLocaleDateString('de-DE', options)} Uhr</p>
                        <p style="text-align: center"><img src = ${weatherImage.src}></img></p>
                        <p style="text-align: center">${"Temperatur: " + Math.round(weatherData.current.temp) + "°C"}<br>
                        ${"Windgeschwindigkeit: " + weatherData.current.wind_speed + " m/s"}<br>
                        ${"Windrichtung: " + weatherData.current.wind_deg + "°"}<br>
                        ${"Luftfeuchtigkeit: " + weatherData.current.humidity + " %"}<br>
                        ${"Bewölkung: " + weatherData.current.clouds + " %"}</p>`)
}