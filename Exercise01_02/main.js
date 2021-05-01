/**
 * @author Fabian Schumacher
 * @MatrNr 462427
 * The file creates an HTML-table out of the calculated information in the calculateTable.js
 */

"use strict"

/**
 * The function creates HTML-Code to generate a table out of a two-dimensional array
 * that can be pasted into an HTML document afterwards.
 * 
 * @param {2D array} myArray 
 * @returns -  a String of the generated HTML-Code
 */
 function makeTableHTML(myArray) {
    var result = "<table border=1>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</table>";

    return result;
}

// store HTML-element in variables to work with them
let upload = document.getElementById("upload")
let uploadfield = document.getElementById("uploadfield")
let table = document.getElementById("table")
let buttonUploaded = document.getElementById("buttonUploaded")
let buttonDefault = document.getElementById("buttonDefault")
let lineStringButton = document.getElementById("lineStringButton")
let polygonButton = document.getElementById("polygonButton")


/**
 * Event listener that checks for a click event on the given button. When the button is clicked, the callback function
 * checks wheather there is a uploaded file. If there is a uploaded file, the file gets read and parsed to JSON. 
 * The parsed JSON object is then used for our calculations. If there is no file, the function throws an alert.
 * 
 * @param {string} type - the type of the event listened to
 * @param {EventListener} listener - function to call when the event is triggered
 */ 
buttonUploaded.addEventListener('click', function(){
    if  (uploadfield.files.length > 0)                          // if a file was selected
    {
        var reader = new FileReader()                           // read the file via FileReader()
        reader.readAsText(uploadfield.files[0]);                // reads the input file as a text
        // event listener to check, if the reader has read the file
        reader.addEventListener('load', function(){
            let routeJSON = JSON.parse(reader.result);          // parses the text-read input file as JSON
            let routeStringJSON = JSON.stringify(routeJSON);    // makes a string out of the JSON file
            let polygonJSON = makePolygonToGJSON(polygon);      // creates a GeoJSON object out of the given polygon
            let polyStringJSON = JSON.stringify(polygonJSON);   // creates a string out of the GeoJSON file

            showTableResults(routeJSON, routeStringJSON, polyStringJSON);
        })
    }
    else
    {
        alert("no file was uploaded")
    }
})


/**
 * Event listener that checks for a click event on the given button. When the button is clicked the callback function
 * creates a GeoJSON object out of the given route array and uses the object for the calculations defined in the
 * showTableresults function.
 * 
 * @param {string} type - the type of the event listened to
 * @param {EventListener} listener - function to call when the event is triggered
 */ 
buttonDefault.addEventListener('click', function(){
    let routeJSON = makePointArrayToGJSON(route);           // creates a GeoJSON object out of the given route
    let routeStringJSON = JSON.stringify(routeJSON);        // makes a string out of the JSON object
    let polygonJSON = makePolygonToGJSON(polygon);          // creates a GeoJSON object out of the given polygon
    let polyStringJSON = JSON.stringify(polygonJSON);       // creates a string out of the GeoJSON polygon object
    
    showTableResults(routeJSON, routeStringJSON, polyStringJSON);
})


/**
 * The function inserts all the nescessary informations to the HTML document and calls the functions for the
 * calculations for the sections. In addition the function makes the table division visible on the HTML page.
 * 
 * @param {GeoJSON object} result - GeoJSON LineString object
 * @param {string} routeStringJSON - String of a GeoJSON object code
 * @param {string} polyStringJSON - String of a GeoJSON object code
 */
function showTableResults(result, routeStringJSON, polyStringJSON)
{
    // Refers to the jsonCode paragrph and inserts the string generated in the variables
    document.getElementById("routeJSONcode").innerHTML = routeStringJSON;
    document.getElementById("polygonJSONcode").innerHTML = polyStringJSON;

    // Refers to the table body from the html-document and inserts the code generated in the makeTableHTML-function.
    document.getElementById("tbody").innerHTML = makeTableHTML(convertTableValues(result.coordinates));

    // Refers to the paragraph of the html-document and creates the output for the total length.
    document.getElementById("totalLength").innerHTML = "Total length in meter: "+ round(calculateTotalDistance(result.coordinates),2)+"m";

    // Makes the table division visible
    table.style.display = "block";
    JSONcode.style.display = "block"
}


/**
 * Event listener that checks for a click event on the given button.
 * When the button is clicked the callback function makes the roueJSONCode-paragraph visible or non-visible,
 * depending on its current status.
 * 
 * @var {boolean} showRouteCode - variable that switches from true or flase depending on the current display status
 */
let showRouteCode = false;
lineStringButton.addEventListener('click', function(){
    if (showRouteCode == false)
    {
        routeJSONcode.style.display = "block";
        showRouteCode = true;
    }
    else{
        routeJSONcode.style.display = "none";
        showRouteCode = false;
    } 
})


/**
 * Event listener that checks for a click event on the given button.
 * When the button is clicked the callback function makes the polygonJSONCode-paragraph visible or non-visible,
 * depending on its current status.
 * 
 * @var {boolean} showPolygonCode - variable that switches from true or flase depending on the current display status
 */
let showPolygonCode = false;
polygonButton.addEventListener('click', function(){
    if (showPolygonCode == false)
    {
        polygonJSONcode.style.display = "block";
        showPolygonCode = true;
    }
    else{
        polygonJSONcode.style.display = "none";
        showPolygonCode = false;
    } 
})

/**
 * The function creates and returns a GeoJSON LineString object out of a given 2D input array of coordinates.
 * 
 * @param {[[number, number],...]} inputCoordinates - 2D array of coordinates in the form [[lng, lat],...]
 * @returns - the created GeoJSON object
 */
function makePointArrayToGJSON(inputCoordinates){
    let geojson = {
        "type": "LineString",
        "coordinates": inputCoordinates,
    }

    return geojson;
}


/**
 * The function creates and returns a GeoJSON Polygon object out of a given 2D input array of coordinates,
 * that form a polygon (first coordinate == lastecoordinate).
 * 
 * @param {[[number, number],...]} inputCoordinates - 2D array of coordinates in the form [[lng, lat],...]
 * @returns - the created GeoJSON object
 */
function makePolygonToGJSON(inputCoordinates){
    let geojson = {
        "type": "Polygon",
        "coordinates": inputCoordinates,
    }

    return geojson;
}