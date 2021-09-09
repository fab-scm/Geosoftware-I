var busStopObj;

var turfPoints;

var haltestelleButton = document.getElementById("haltestelleButton");

// Icon settings
// var haltestelleIcon = L.icon({
//     iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Zeichen_224_-_Haltestelle%2C_StVO_2017.svg'
// })

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
    var checkedSights = getCheckedSights();
    console.log(checkedSights);
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
                var haltestelleMarker = L.marker([haltestelle.geometry.coordinates[1], haltestelle.geometry.coordinates[0]]);
                haltestelleMarker.addTo(map);
            }
            // else{
            //     alert("DU HUSO")
            // }
        }
    }
    else {
        alert("Bitte nur eine Sehenswürdigkeit auswählen.")
    }
})

// var getCheckedSights = getCheckedSights();
// console.log(getCheckedSights);
console.log(sights);




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
