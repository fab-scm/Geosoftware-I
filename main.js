"use strict"

// Bounding box Coordinates for the 
const leftUpperCoordinate = polygon[3];
const rightBottomCoordinate = polygon[1];

let resultArray = new Array(route.length);
let intersectIndex = [];
let distances = new Array(route.length-1);
let distancesSubsequences = [];
let contentTable = [];

// The function can find out whether a point is Inside
// Works only with polygons which are parellel to the longitude and latitude-axis 
// Input: point [long,lat], leftUpperCorner (of the polygon) [long,lat], rightBottomCorner [long, lat] (of the polygon)
// returns true if the point is inside the polygon, else not.
function isPointInsidePolygon(coordinate, leftUpperCoordinateBBox, rightBottomCoordinateBBox) {
        return (coordinate[0] > leftUpperCoordinateBBox[0] && coordinate[0] < rightBottomCoordinateBBox[0] && coordinate[1] < leftUpperCoordinateBBox[1] && coordinate[1] > rightBottomCoordinateBBox[1]);
}


// The function fills the result Array with true if the matching coordinate is inside the polygon
// and false if the matching coordinate is outside the Polygon.
function fillResultArray(){
    for (let index = 0; index < route.length; index++) {
        resultArray[index] = isPointInsidePolygon(route[index],leftUpperCoordinate, rightBottomCoordinate);
    }
        
}


function fillIntersectIndex() {
    for (let index = 0; index < route.length; index++) {
        if (index == 0 || index == resultArray.length -1){
            intersectIndex.push(index);
        }
        else if (!resultArray[index] && (resultArray[index-1] || resultArray[index+1]))
            intersectIndex.push(index);
    }
}


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
    var d = R * c; // Distance in km
    return d * 1000;
}
  
function deg2rad(deg) {
    return deg * (Math.PI/180)
}


function calculatePointToPointDistances(){
    for (var index = 0; index < route.length-1; index++) {
        distances[index] = getDistanceFromLatLonInMeters(route[index], route[index+1]);
    }
}


function calculateSubsequenceDistances(){
    for (let index = 0; index < intersectIndex.length - 1; index++) {
        var sum = 0
        for (let i = intersectIndex[index]; i < intersectIndex[index + 1]; i++) {
            sum += distances[i];
        }
        distancesSubsequences.push(sum);
    }
}

function calculateTotalDistance(){
    var sum = 0;
    for (var index = 0; index < distancesSubsequences.length; index++){
        sum += distancesSubsequences[index];
    }
    return sum;
}


function fillContentTable(){
    for (let index = 0; index < distancesSubsequences.length; index++) {
        var tableRow = Array(5);
        tableRow[0] = index + 1;
        tableRow[1] = distancesSubsequences[index];
        tableRow[2] = route[intersectIndex[index]];
        tableRow[3] = route[intersectIndex[index + 1]];
        tableRow[4] = resultArray[intersectIndex[index] + 1];

        contentTable.push(tableRow);
    }
}



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



fillResultArray();
console.table(resultArray);
fillIntersectIndex();
console.table(intersectIndex);
console.log(getDistanceFromLatLonInMeters(route[0], route[1]));
calculatePointToPointDistances();
console.table(distances);


calculateSubsequenceDistances();
console.table(distancesSubsequences);
console.log(calculateTotalDistance());
// console.table(distancesSubsequences.sort((a,b) => a-b));
fillContentTable();


console.table(contentTable);
contentTable.sort((a,b) => b[1] - a[1]);
console.table(contentTable);
convertArrayValues(contentTable);
document.getElementById("tbody").innerHTML = makeTableHTML(contentTable)
document.getElementById("totalLength").innerHTML = "Total length: " + (Math.round(calculateTotalDistance() * 100)) / 100 + " meters";