"use strict"

var busStopObj;
var turfPoints;

var haltestellenMarker = new L.FeatureGroup();

var haltestelleButton = document.getElementById("haltestelleButton");



// Icon settings
var haltestelleIcon = L.icon({
    //iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Zeichen_224_-_Haltestelle%2C_StVO_2017.svg',
    iconUrl: 'http://localhost:3000/javascripts/haltestelle.png',
    iconSize:     [35, 35], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
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
                var haltestelleMarker = L.marker([haltestelle.geometry.coordinates[1], haltestelle.geometry.coordinates[0]], {icon: haltestelleIcon});
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
