/**
 * @author Fabian Schumacher
 * @MatrNr 462427
 * The file holds all the necessary functions to fill the table with the right content
 */

 "use strict"

 // Variables
 
 /**
  * Constant that holds the left upper coordinates of the polygon.
  * Array of length two in the format [lng, lat]
  */
 const leftUpperCoordinate = polygon[3];
 
 /**
  * Constant that holds the right bottom coordinates of the polygon.
  * Array of length two in the format [lng, lat]
  */
 const rightBottomCoordinate = polygon[1];
 
 
 ///////////////
 // functions //
 ///////////////
 
 /**
  * The function can find out whether a point is inside or outside a given polygon.
  * Works only with polygons which are parellel to the longitude and latitude-axis.
  * Therefore the given coordinate is compared to the characteristic values for longitude and latitude of the polygon.
  * It is adequate to only use the left upper and the right bottom coordinate of the polygon, because these two route
  * hold all characteristic coordinates. The BBox Coordinates are set to fixed values which are defined in the upper.
  * 
  * @param {[number, number]} coordinate - [lng, lat] in WGS84 - input coordinate
  * @param {[number, number]} leftUpperCoordinateBBox -  [lng, lat] in WGS84 - the left upper coordinate of the input polygon
  * @param {[number, number]} rightBottomCoordinateBBox - [lng, lat] in WGS84 - the right bottom coordinate of the input polygon
  * @returns - true if the coordinate is inside the polygon, else false.
  */
 function isCoordinateInsidePolygon(coordinate, leftUpperCoordinateBBox = leftUpperCoordinate, rightBottomCoordinateBBox = rightBottomCoordinate) {
         return (coordinate[0] > leftUpperCoordinateBBox[0] && coordinate[0] < rightBottomCoordinateBBox[0] && coordinate[1] < leftUpperCoordinateBBox[1] && coordinate[1] > rightBottomCoordinateBBox[1]);
 }
 
 
 /**
  * The function fills an array with true if the current coordinate is inside the polygon
  * and false if the current coordinate is outside the polygon.
  * 
  * @param {[[number, number],...]} route - [[lng, lat],...] in WGS84 -  an array of coordinates which form a route
  * @param {[number]} leftUpperCoordinateBBox - [lng, lat] in WGS84 - the left upper coordinate of the input polygon
  * @param {[number]} rightBottomCoordinateBBox - [lng, lat] in WGS84 - the right bottom coordinate of the input polygon
  * @returns - an array of booleans, that contains for each coordinate of the input route the value of the isCoordinateInsidePolygon()-function
  */
 function areCoordinatesInsidePolygon(route, leftUpperCoordinateBBox, rightBottomCoordinateBBox){
     let result = [];     // Array that gets filled with the results of the function isCoordinateInsidePolygon (Boolean)  
     for (let i = 0; i < route.length; i++) {
         result[i] = isCoordinateInsidePolygon(route[i], leftUpperCoordinateBBox, rightBottomCoordinateBBox);
     }
     return result;  
 }
 
 
 /**
  * The function fills an array with the indices of the intersections of the route with the polygon.
  * If two consecutive coordinates do not have the same value in the array calculated by areCoordinatesInsidePolygon,
  * it can be interpreted as an intersection. The function select the first coordinate before the root enters the polygon 
  * and the first coordinate after the route leaves the polygon as intersections and puts their index in a new array which
  * is returned at the end.
  * 
  * @param {[[number, number],...]} route - [[lng, lat],...] in WGS84 -  an array of coordinates which form a route
  * @param {[number]} leftUpperCoordinateBBox - [lng, lat] in WGS84 - the left upper coordinate of the input polygon
  * @param {[number]} rightBottomCoordinateBBox - [lng, lat] in WGS84 - the right bottom coordinate of the input polygon
  * @returns - an array of numbers (the indeces of the intersection coordinates and the start/end-coordinate of the route)
  */
 function findAllIntersectIndices(route, leftUpperCoordinateBBox = leftUpperCoordinate, rightBottomCoordinateBBox = rightBottomCoordinate) {
     let pointInsidePolygonArray = areCoordinatesInsidePolygon(route, leftUpperCoordinateBBox, rightBottomCoordinateBBox);
     let intersectIndices = [];          // array that gets filled with the indeces of the intersection coordinate of the route with the polygon
     for (let i = 0; i < pointInsidePolygonArray.length; i++) {
         if (i == 0 || i == pointInsidePolygonArray.length -1){      // indeces of the start/end-coordinate are pushed into the array
             intersectIndices.push(i);
         }
         else if (!pointInsidePolygonArray[i] && (pointInsidePolygonArray[i-1] || pointInsidePolygonArray[i+1]))     // the route enters or leaves the polygon only when the boolean is false and the next or previous is true
             intersectIndices.push(i);
     }
     return intersectIndices;
 }
 
 
 /**
  * The function calculates the distance between two geographic route given in the format of [lng, lat] in WGS84.
  * 
  * 
  * src: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-route-haversine-formula
  * 
  * @param {[number, number]} p1 - [lng, lat] in WGS84
  * @param {[number, number]} p2 - [lng, lat] in WGS84
  * @returns distance between the two coordinates in meters
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
  * Converts degrees to radian values.
  * 
  * @param {number} deg - given value in degrees
  * @returns the radian value
  */
 function deg2rad(deg) {
     return deg * (Math.PI/180)
 }
 
 
 /**
  * The function fills an array with all the consecutive point-to-point-distances of the route array.
  * Therefore it uses the getDistanceFromLatLonInMeters - function.
  * 
  * @param {[[number, number],...]} route - [[lng, lat],...] in WGS84 - an array of coordinates which form a route
  * @returns an array with the consecutive distances. array[n] stores the distance between route[n] and [n+1].
  */
 function getCoordinateToCoordinateDistances(route){
     let coordinateToCoordinateDistances = Array(route.length - 1);        // Array filled with all consecutive point-to-point distances. The length is -1 smaller because the last coordinate of the route array has no consecutive coordinate
     for (var i = 0; i < coordinateToCoordinateDistances.length; i++) {
         coordinateToCoordinateDistances[i] = getDistanceFromLatLonInMeters(route[i], route[i+1]);
     }
     return coordinateToCoordinateDistances;
 }
 
 
 /**
  * The function calculates the coordinateToCoordinateDistances of the subsequences of the route by summing up
  * the point-to-point coordinateToCoordinateDistances for the sequences. The start of the sequences is given in the intersectIndices by use of
  * the function findAllIntersectIndices().
  * 
  * @param {[[number, number],...]} route - [[lng, lat],...] in WGS84 - an array of coordinates which form a route
  * @param {[number]} leftUpperCoordinateBBox - [lng, lat] in WGS84 - the left upper coordinate of the input polygon
  * @param {[number]} rightBottomCoordinateBBox - [lng, lat] in WGS84 - the right bottom coordinate of the input polygon
  * @returns an array with the distances for all subsequences of the route. The distance of the first section is stored in array[0].
  */
 function calculateSubsequenceDistances(route, leftUpperCoordinateBBox = leftUpperCoordinate, rightBottomCoordinateBBox = rightBottomCoordinate){
     let distancesSubsequences = [];     // Array that gets filled with the distances of all subsequences
     let intersectIndices = findAllIntersectIndices(route, leftUpperCoordinateBBox, rightBottomCoordinateBBox);
     let coordinateToCoordinateDistances = getCoordinateToCoordinateDistances(route);
     for (let i = 0; i < intersectIndices.length - 1; i++) {
         var sum = 0
         for (let j = intersectIndices[i]; j < intersectIndices[i + 1]; j++) {
             sum += coordinateToCoordinateDistances[j];
         }
         distancesSubsequences.push(sum);
     }
     return distancesSubsequences;
 }
 
 
 /**
  * The function calculates the total distance by summing up all subsequence-distances.
  *  
  * @param {[[number, number],...]} route - [[lng, lat],...] in WGS84 - an array of coordinates which form a route
  * @returns the total distance (number) of the route in meters
  */
 function calculateTotalDistance(route){
     let distancesSubsequences = calculateSubsequenceDistances(route);
     var sum = 0;
     for (var i = 0; i < distancesSubsequences.length; i++){
         sum += distancesSubsequences[i];
     }
     return sum;
 }
 
 
 /**
  * The function fills the array contentTable with the right information:
  * first column: index of the subsequence
  * second column: length of the subsequence
  * third column: first coordinate of the subsequence
  * fourth column: last coordinate of the subsequence
  * fifth column: boolean if the subsequnce is inside or outside the polygon
  * After filling the array, the content gets sorted by the length of the subsequences (second column).
  * 
  * @param {[[number, number],...]} route - [[lng, lat],...] in WGS84 - an array of coordinates which form a route
  * @param {[number]} leftUpperCoordinateBBox - [lng, lat] in WGS84 - the left upper coordinate of the input polygon
  * @param {[number]} rightBottomCoordinateBBox - [lng, lat] in WGS84 - the right bottom coordinate of the input polygon
  * @returns a 2D array with the sorted information needed for the HTML-document
  */
 function fillContentTable(route, leftUpperCoordinateBBox = leftUpperCoordinate, rightBottomCoordinateBBox = rightBottomCoordinate){
     
     let tableData = [];     // Array that gets filled with the content for the table shown on the HTML page
     let distancesSubsequences = calculateSubsequenceDistances(route, leftUpperCoordinateBBox, rightBottomCoordinateBBox);
     let intersectIndices = findAllIntersectIndices(route, leftUpperCoordinateBBox, rightBottomCoordinateBBox);
     let pointInsidePolygonArray = areCoordinatesInsidePolygon(route, leftUpperCoordinateBBox, rightBottomCoordinateBBox);
     for (let i = 0; i < distancesSubsequences.length; i++) {
         var tableColumn = [];
         tableColumn[0] = i + 1;
         tableColumn[1] = distancesSubsequences[i];
         tableColumn[2] = route[intersectIndices[i]];
         tableColumn[3] = route[intersectIndices[i + 1]];
         tableColumn[4] = pointInsidePolygonArray[intersectIndices[i] + 1];
 
         tableData.push(tableColumn);
     }
     tableData.sort((a,b) => b[1] - a[1]);
     return tableData;
 }
 
 
 /**
  * This function converts the values in the table-array in a more readable format.
  * The function rounds the lengths to two decimal digits, puts brackets around the coordinates and converts "True" to "Yes" and "False" to "No".
  * 
  * @param {[[number, number],...]} route - [[lng, lat],...] in WGS84 - an array of coordinates which form a route
  * @param {[number]} leftUpperCoordinateBBox - [lng, lat] in WGS84 - the left upper coordinate of the input polygon
  * @param {[number]} rightBottomCoordinateBBox - [lng, lat] in WGS84 - the right bottom coordinate of the input polygon
  * @returns - a 2D array with the sorted information needed for the HTML-document in a more readable format
  */
  function convertTableValues(route, leftUpperCoordinateBBox = leftUpperCoordinate, rightBottomCoordinateBBox = rightBottomCoordinate){
     let rawData = fillContentTable(route, leftUpperCoordinateBBox, rightBottomCoordinateBBox);
     let tableContent = rawData;
     for (let i = 0; i < rawData.length; i++) {
         tableContent[i][1] = round(rawData[i][1],2);
         tableContent[i][2] = "(" + rawData[i][2] +")"; 
         tableContent[i][3] = "(" + rawData[i][3] +")"; 
         if(rawData[i][4]){
             tableContent[i][4] = "Yes";
         } else {
             tableContent[i][4] = "No"
         }
     }
     return tableContent;
 }
 
 
 /**
   * Rounds a value by a given precision
   * @param {number} x - number which should be rounded.
   * @param {number} n - how many values  digits?
   * @returns - rounded value
   */
  function round(x,n){
     return Math.round(x * 10**n)/10**n;
  }



 ///////////////
 // test area //
 ///////////////

 /*

 // commanding and displaying the results

 console.log(isCoordinateInsidePolygon(route[0], leftUpperCoordinate, rightBottomCoordinate));
 console.table(areCoordinatesInsidePolygon(route, leftUpperCoordinate, rightBottomCoordinate));
 console.table(findAllIntersectIndices(route, leftUpperCoordinate, rightBottomCoordinate));
 console.table(getCoordinateToCoordinateDistances(route));
 calculateSubsequenceDistances(route, leftUpperCoordinate, rightBottomCoordinate);
 console.log(calculateTotalDistance(route));
 console.table(fillContentTable(route, leftUpperCoordinate, rightBottomCoordinate));                   
 console.table(convertTableValues(route, leftUpperCoordinate, rightBottomCoordinate));

 */