 "use strict"


 // Event-listener that listens to a leaflet draw event. The function gets called
 // every time the event (new marker or polygon drawn) happens.
 map.on('draw:created', function(event) {
    //console.log(event.layer._latlng);
    console.log(event)
     
    // add a temporal marker or polygon to that map
    var tempMarker = event.layer.addTo(map);
    //drawnItems.addLayer(tempMarker);
    
    // html-form, used for marker-/polygon-popup
    var popupContent =      '<form id="popup-form">\
                                <p>\
                                    <div>\
                                            <label for="name">Name:</label>\
                                            <input id="name" class="popup-input" type="text" name="name" style="float: right;"/>\
                                    </div>\
                                </p>\
                                <p>\
                                    <div style="padding-top: 10px;">\
                                        <label for="beschreibung">Beschreibung:</label>\
                                        <input id="beschreibung" class="popup-input" type="text" name="beschreibung" style="float: right;"/>\
                                    </div>\
                                </p>\
                                <p>\
                                    <div style="padding-top: 10px;">\
                                        <label for="url">URL:</label>\
                                        <input id="url" class="popup-input" type="text" name="url" style="float: right;"/>\
                                    </div>\
                                </p>\
                                <p>\
                                    <div style="padding-top: 10px;">\
                                        <button id="send" type="button">Send</button>\
                                    </div>\
                                </p>\
                            </form>';
 

    // binds a popup to every drawn marker or polygon, that contains a form where you can enter a name, url and description to submit              
    tempMarker.bindPopup(popupContent,{
        keepInView: false,
        closeButton: true
    }).openPopup();
     
    // Event-listener, that listens to a leaflet 'click' event. The function that gets called removes the current tempMarker.
    map.on('click', function(e){
         tempMarker.remove();
    })
    //console.log(tempMarker);
    //console.log(event.layerType);
 
    // variable that contains the the "send"-button
    let button = document.getElementById("send");
 
    /**
     * Event-listener that listens to a 'click'-event on the send-button. The function that gets called when the event happens
     * takes all the values of the popup-form, validates the entries, builds a geojson-string and sends it to the server.
     * Validation:  - Check if there is a name entry
     *              - Check if the url entry contains a wikipedia url. 
     *                  -> If yes, the wikipedia-API is used to get the first 3 sentences of the wikipedia article as the sight description.
     *                  -> If not, use the entered description or set 'Keine Informationen vorhanden' as description, if not descriptionis given. 
     */ 
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


 // variables that store the necessary HTML-objects
var deleteButton = document.getElementById('deleteButton');

 /**
  * Eventlistener that listens for a click event on the deleteButton. 
  * If the button is clicked the callback function is executed which sends 
  * an ajax-POST-request to the express server. 
  * The data sent to the server are the id's of the routes which should be deleted from the database.
  * After the ajax-request is done the page gets refreshed.
  * 
  */
 deleteButton.addEventListener('click', function(){
    var checkedSights = getCheckedSights();
    var objectDataString = JSON.stringify(checkedSights);
    $.ajax({
        async: false,
        type: "POST",
        url: "/edit/delete",
        //dataType: "json",
        data: {
            o: objectDataString
        },
        success: function (data) {
            //alert('success');
            window.location.href = "/edit"
        },
        error: function () {
            alert('error')
        }
    })
    .done()
 })



 /**
  * The function iterates through all HTML-objects from type input:checkbox
  * and puts all ids of the checked boxes into one array which is stored in an js object.
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
    console.log(obj);
    return obj;
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



 function extractCoordinatesLngLat(coords) {
    var coordinates = `[[`;
    for (let i = 0; i < coords.length; i++) {
        coordinates += `[${coords[i].lng}, ${coords[i].lat}],`;
    }
    coordinates += `[${coords[0].lng}, ${coords[0].lat}]]]`;
    return coordinates;
 }

 

 function getSightNameFromURL(url) {
    var urlArray = url.split('/');
    var sightName = urlArray[4];
    console.log(sightName);
    return sightName;
 }