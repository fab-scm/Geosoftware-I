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
    var popupContent =    '<form role="form" id="form" enctype="multipart/form-data" class = "form-horizontal" onsubmit="addMarker()">'+
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
                                '<div style="text-align:center;" class="col-xs-4"><button type="submit" value="submit" class="btn btn-outline-success trigger-submit">Speichern</button></div>'+
                                '<div style="text-align:center;" class="col-xs-4"><button type="submit" value="submit" class="btn btn-outline-danger trigger-submit">Löschen</button></div>'+
                            '</div>'+
                        '</form>';
    tempMarker.bindPopup(popupContent,{
        keepInView: false,
        closeButton: true
    }).openPopup();
    
    map.on('click', function(e){
        tempMarker.remove();
    })

    $("#form").submit(function(e){
        drawnItems.addLayer(tempMarker);
        console.log("submitted");
        console.log(e);
        //console.log("didnt submit");
        //var date =$("#date").val();
        //console.log(date);
        console.log(drawnItems);
    });

 })

if (window.location.pathname == "/edit") {
    // adds the draw control to the map
    map.addControl(drawControl);

    $.ajax({
        type: "GET",
        url: "/edit",
        dataType: "json",
        data: {
            o: objectDataString
        },
        success: function (data) {
            alert('success');
        },
        error: function () {
            alert('error')
        }
    })
    .done(window.location.href = "/manageRoutes")
}
