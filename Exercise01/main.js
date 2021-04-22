"use strict"

// Variables

// Bounding box Coordinates of the polygon. Later used in the the function isPointInsidePolygon.
// Constant values because the polygon remains the same for all points.
const leftUpperCoordinate = polygon[3];
const rightBottomCoordinate = polygon[1];

// Variables
let pointInsidePolygonArray = [];           // Array filled with the results of the function fillPointInsidePolygonArray (Boolean)
let intersectIndex = [];                    // Array filled with the indeces (Integer) of the intersection coordinate of the route with the polygon calculated in the function fillIntersectionIndex
let pointToPointDistances = [];             // Array filled with all consecutive point-to-point distances
let distancesSubsequences = [];             // Array filled with the distances of all subsequences
let contentTable = [];                      // Array filled with the content for the table shown on the HTML page


// Functions

/**
 * The function can find out whether a point is inside or outside a given polygon.
 * Works only with polygons which are parellel to the longitude and latitude-axis.
 * Therefore the given coordinate is compared to the characteristic values for longitude and latitude of the polygon.
 * 
 * @param {[float, float]} coordinate [longitude, latitude]
 * @param {[float, float]} leftUpperCoordinateBBox [longitude, latitude] left upper coordinate oft the polygon
 * @param {[float, float]} rightBottomCoordinateBBox [longitude, latitude] right bottom corner of the polygon
 * @returns true if the point is inside the polygon, else not.
 */
function isPointInsidePolygon(coordinate, leftUpperCoordinateBBox, rightBottomCoordinateBBox) {
        return (coordinate[0] > leftUpperCoordinateBBox[0] && coordinate[0] < rightBottomCoordinateBBox[0] && coordinate[1] < leftUpperCoordinateBBox[1] && coordinate[1] > rightBottomCoordinateBBox[1]);
}


// 
/** 
 * The function fills the pointInsidePolygonArray with true if the current coordinate is inside the polygon
 * and false if the current coordinate is outside the polygon.
 * 
 */
function fillPointInsidePolygonArray(){
    for (let index = 0; index < route.length; index++) {
        pointInsidePolygonArray[index] = isPointInsidePolygon(route[index], leftUpperCoordinate, rightBottomCoordinate);
    }    
}


/**
 * The function fills the intersectIndex with the indices of the the intersection coordinates of the route
 * with the polygon. It always selects the first coordinate before the root enters the polygon and
 * the first coordinate after the route leaves the polygon.
 * 
 */
function fillIntersectIndex() {
    for (let index = 0; index < route.length; index++) {
        if (index == 0 || index == pointInsidePolygonArray.length -1){      // first and last indeces are pushed into the array
            intersectIndex.push(index);
        }
        else if (!pointInsidePolygonArray[index] && (pointInsidePolygonArray[index-1] || pointInsidePolygonArray[index+1]))     // //The route enters or leaves the polygon only when the boolean is false and the next or previous is true
            intersectIndex.push(index);
    }
}


/**
 * The function calculates the distance between two coordinates given in the format of [longitude, latitude].
 * (WGS84)
 * src: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 * 
 * @param {float array} p1 first coordinate [longitude, latitude]
 * @param {float array} p2 second coordinate [longitude, latitude]
 * @returns distance between the two coordinates
 */
function getDistanceFromLatLonInMeters(p1, p2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(p2[1]-p1[1]);  // deg2rad below
    var dLon = deg2rad(p2[0]-p1[0]); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(p1[1])) * Math.cos(deg2rad(p2[1])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in
    return d * 1000;
}


/**
 * Converts degrees to radiant values.
 * 
 * @param {*} deg given value in degrees
 * @returns degrees
 */
function deg2rad(deg) {
    return deg * (Math.PI/180)
}


/**
 * The function fills the array pointToPointDistances with all the consecutive point-to-point pointToPointDistances of the route array.
 * Therefore it uses the getDistanceFromLatLonInMeters - function.
 */
function calculatePointToPointDistances(){
    for (var index = 0; index < route.length-1; index++) {
        pointToPointDistances[index] = getDistanceFromLatLonInMeters(route[index], route[index+1]);
    }
}


/**
 * The function calculates the pointToPointDistances of the subsequences of the route by summing up
 * the point-to-point pointToPointDistances for the sequences. The start of the sequences is given in the intersectIndex.
 * 
 */
function calculateSubsequenceDistances(){
    for (let index = 0; index < intersectIndex.length - 1; index++) {
        var sum = 0
        for (let i = intersectIndex[index]; i < intersectIndex[index + 1]; i++) {
            sum += pointToPointDistances[i];
        }
        distancesSubsequences.push(sum);
    }
}


/**
 * The function calculates the total distance by summing up all point-to-point pointToPointDistances.
 * 
 * @returns the total distance as a float
 */
function calculateTotalDistance(){
    var sum = 0;
    for (var index = 0; index < distancesSubsequences.length; index++){
        sum += distancesSubsequences[index];
    }
    return sum;
}


/**
 * The function fills the variable contentTable with the right information.
 * first row: index of the subsequence
 * second row: length of the subdequence
 * third row: first coordinate of the subsequence
 * fourth row: last coordinate of the subsequence
 * fifth row: boolean if the subsequnce is inside or outside the polygon
 */
function fillContentTable(){
    for (let index = 0; index < distancesSubsequences.length; index++) {
        var tableRow = [];
        tableRow[0] = index + 1;
        tableRow[1] = distancesSubsequences[index];
        tableRow[2] = route[intersectIndex[index]];
        tableRow[3] = route[intersectIndex[index + 1]];
        tableRow[4] = pointInsidePolygonArray[intersectIndex[index] + 1];

        contentTable.push(tableRow);
    }
}


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


/**
 * This function converts the values in the result table.
 * The function rounds the lengths to two decimal digits,
 * puts brackets around the coordinates and converts "True" to "Yes" and "False" to "No".
 * @param {*} myArray 
 */
function convertArrayValues(myArray) {
    for(var i=0; i<myArray.length; i++) {
        for(var j=0; j<myArray[i].length; j++){
           if (j == 1){
                myArray[i][j] = Math.round(myArray[i][j] * 100) / 100;
           }
           if (j == 2 || j == 3){
                myArray[i][j] = "(" + myArray[i][j] + ")";
           }
           if (j == 4) {
               if (myArray[i][j] == true) {
                    myArray[i][j] = "Yes";
               }
               if (myArray[i][j] == false) {
                    myArray[i][j] = "No";
               }

           }
        }
    }
}



// Commands

fillPointInsidePolygonArray();                  // fills the pointInsidePolygonArray
fillIntersectIndex();                           // fills the intersectIndex array
calculatePointToPointDistances();               // calculates and fills the pointToPointDistances array
calculateSubsequenceDistances();                // calculates and fills the distancesSubsequences array
fillContentTable();                             // fills the contentTable array
contentTable.sort((a,b) => b[1] - a[1]);        // sorting the contentTable array by length of the subsequences
convertArrayValues(contentTable);               // converts the table entries and makes them look nice


// Displaying the results

console.table(pointInsidePolygonArray);
console.table(intersectIndex);
console.table(pointToPointDistances);
console.table(distancesSubsequences);
console.log(calculateTotalDistance());
console.table(contentTable);


//Refers to the table body from the html-document and inserts the code generated in the makeTableHTML-function.
document.getElementById("tbody").innerHTML = makeTableHTML(contentTable)

//Refers to the paragraph of the html-document and creates the output for the total length.
document.getElementById("totalLength").innerHTML = "Total length: " + (Math.round(calculateTotalDistance() * 100)) / 100 + " meters";