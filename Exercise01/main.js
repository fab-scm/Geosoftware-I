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
 * @returns a String of the generated HTML-Code
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
 * Event listener that checks for uploaded files and prepares them for working with them
 * 
 * @param {string} type - the type of the event listened to
 * @param {EventListener} listener - function to call when the event is triggered
 */ 
buttonUploaded.addEventListener('click', function(){
    if  (uploadfield.files.length > 0)      // if a file was selected
    {
        var reader = new FileReader()       // read the file via FileReader()
        reader.readAsText(uploadfield.files[0]);   // reads the input file as a text
        // event listener to check, if the reader has read the file
        reader.addEventListener('load', function(){
            var result = JSON.parse(reader.result); // parses the text-read input file as JSON
            var string = JSON.stringify(result);
            let polygonJSON = makePolygonToGJSON(polygon);
            let polyStringJSON = JSON.stringify(polygonJSON);

            // Refers to the jsonCode paragrph and inserts the string generated in the variables
            document.getElementById("routeJSONcode").innerHTML = string;
            document.getElementById("polygonJSONcode").innerHTML = polyStringJSON;

            // Refers to the table body from the html-document and inserts the code generated in the makeTableHTML-function.
            document.getElementById("tbody").innerHTML = makeTableHTML(convertTableValues(result.coordinates));

            // Refers to the paragraph of the html-document and creates the output for the total length.
            document.getElementById("totalLength").innerHTML = "Total length in meter: "+ round(calculateTotalDistance(result.coordinates),2)+"m";

            showTableResults();
        })
    }
    else
    {
        alert("There was no file uploaded")
    }
})


/**
 * Event listener that checks for uploaded files and prepares them for working with them
 * 
 * @param {string} type - the type of the event listened to
 * @param {EventListener} listener - function to call when the event is triggered
 */ 
buttonDefault.addEventListener('click', function(){
    let routeStringJSON = createJSONstring(route);
    let routeJSON = JSON.parse(routeStringJSON);
    let polygonJSON = makePolygonToGJSON(polygon);
    let polyStringJSON = JSON.stringify(polygonJSON);
    
    // Refers to the jsonCode paragrph and inserts the string generated in the variables
    document.getElementById("routeJSONcode").innerHTML = routeStringJSON;
    document.getElementById("polygonJSONcode").innerHTML = polyStringJSON;


    // Refers to the table body from the html-document and inserts the code generated in the makeTableHTML-function.
    document.getElementById("tbody").innerHTML = makeTableHTML(convertTableValues(routeJSON.coordinates));

    // Refers to the paragraph of the html-document and creates the output for the total length.
    document.getElementById("totalLength").innerHTML = "Total length in meter: "+ round(calculateTotalDistance(routeJSON.coordinates),2)+"m";

    showTableResults();
})


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

function makePointArrayToGJSON(inputPoints){
    let json = {
        "type": "LineString",
        "coordinates": inputPoints,
    }

    return json;
}

function makePolygonToGJSON(inputPoints){
    let json = {
        "type": "Polygon",
        "coordinates": inputPoints,
    }

    return json;
}

function createJSONstring(array){
    var string = '{"type":"LineString","coordinates":[';
    for (var i = 0; i < array.length-1; i++)
    {
        string += '[' + array[i].toString() + '],';
    }
    string += '[' + array[array.length-1].toString() + ']' + ']}'
    return string;
}


/**
 * Function to make the table division visible and the upload division non-visible for the user
 */
function showTableResults()
{
    table.style.display = "block";
}