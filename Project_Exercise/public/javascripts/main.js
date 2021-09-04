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
 //console.log(sights);

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
     //console.log(event.layer._latlng);
     console.log(event)
     var tempMarker = event.layer.addTo(map);
     //drawnItems.addLayer(tempMarker);
     var popupContent =      '<div class="col-sm-4">Name<input class="form-control" id="name" type="text" name="name" /></div>' +
                             '<div class="col-sm-4">URL<input class="form-control" id="url" type="text" name="url" /></div>' +
                             '<div class="col-sm-4">Beschreibung<input class="form-control" id="beschreibung" type="text" name="beschreibung" /></div>' +
                             '</div><button id="send" class="btn btn-primary mb-2" type="submit">Send</button>';
 
                         
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
        if(event.layerType == "marker") {
            var coords = event.layer._latlng;
        }
        else {
        var coords = event.layer._latlngs[0];
        }
        var type = event.layerType;
        console.log(coords);


        if (name == "") {
            alert("Bitte geben Sie der Sehenswürdigkeit einen Namen.")
        }
        else {
            
            var wikiSightName = getSightNameFromURL(url);

            if (url.includes('wikipedia')) {
                $.ajax({
                    async: false,
                    url: 'http://de.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=true&exsentences=3&explaintext=true&titles=' + wikiSightName + '&origin=*',
                    method: "GET",
                    success: function(data){
                        console.log(data);
                        var key = Object.keys(data.query.pages)[0];
                        var article = data.query.pages[key].extract;
                        console.log(article);
                        beschreibung = article;
                    },
                    error: function () {
                        alert('error')
                    }
                })
                .done()
            }
            else {
                if (beschreibung == "") {
                    beschreibung = "Keine Informationen vorhanden" //möglicherweise Sync-Problem, teilw. wird der String gesetzt und teilw. nicht
                } 
            }
            
    
            let objectDataString = createGeoJSONString(name, url, beschreibung, coords, type);
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
        }

     }) 
  })
 
 
 if (window.location.pathname == "/edit") {
     // adds the draw control to the map
     map.addControl(drawControl);
     //console.log(sights);
 }

 function getSightNameFromURL(url) {
     var urlArray = url.split('/');
     var sightName = urlArray[4];
     console.log(sightName);
     return sightName;
 }

 

 function addSights(sights) {
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
 

 function deleteCurrentMarkers() {
    map.removeLayer(markers);
    markers = new L.FeatureGroup();
}
 
 
 function createGeoJSONString(name, url, beschreibung, coords, type) {
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
                         [${coords.lng}, ${coords.lat}]
                 }
             }]
         }`
         return geoJSON;
     }
     else {
         var coordinates = extractCoordinatesLngLat(coords);
         //console.log(coordinates);
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
                     "type": "Polygon",
                     "coordinates": ${coordinates}
                 }
             }]
         }`
         return geoJSON;
     }
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

 function extractCoordinatesLngLat(coords) {
    var coordinates = `[[`;
    for (let i = 0; i < coords.length; i++) {
        coordinates += `[${coords[i].lng}, ${coords[i].lat}],`;
    }
    coordinates += `[${coords[0].lng}, ${coords[0].lat}]]]`;
    return coordinates;
}


 

var geojson = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {
            "Name": "Historisches Rathaus",
            "URL": "https://en.wikipedia.org/wiki/Historical_City_Hall_of_M%C3%BCnster",
            "Beschreibung": ""
        },
        "geometry": {
            "type": "Point",
            "coordinates":  [51.96320457230038, 7.626743316568538]
            /*[
                [
                    [51.96320457224992, 7.624554634012384],
                    [51.96294344655426, 7.624350786127254],
                    [51.96267901386875, 7.624243497766656],
                    [51.962358387145144, 7.624168395914241],
                    [51.962156754731986, 7.624109387315913],
                    [51.96216667110138, 7.624683380126954],
                    [51.96213692178487, 7.625429034151239],
                    [51.962074118235044, 7.626265883363887],
                    [51.96196421165984, 7.626850604847278],
                    [51.9622022045386, 7.626947164371814],
                    [51.96292361415697, 7.626984715379878],
                    [51.963078967700994, 7.6270276307241165],
                    [51.96316490772806, 7.626909613527459],
                    [51.96320457230038, 7.626743316568538],
                    [51.96322440452292, 7.626539468683404],
                    [51.96352519292086, 7.626174688421089],
                    [51.96370037649272, 7.62618005267541],
                    [51.963743345905925, 7.6260834931508725],
                    [51.963736735250976, 7.625809907831355],
                    [51.96361443749228, 7.625203728593988],
                    [51.96322770995134, 7.625187635339898],
                    [51.96320457224992, 7.624554634012384]
                ]
            ]*/
        }
    }],
    "_id": "61308a74acd8f0b525901738"
}


var geo = L.geoJSON(geojson, {
    coordsToLatLng: function (coords) {
        //                    latitude , longitude, altitude
        //return new L.LatLng(coords[1], coords[0], coords[2]); //Normal behavior
        var cor = new L.LatLng(coords[1], coords[0], coords[2]);
        //console.log(cor);
        return cor;
    }
});
var z = geo._leaflet_id
//console.log(z);
//console.log(geo);
//console.log(geo._layers[geo._leaflet_id-1]._latlng);