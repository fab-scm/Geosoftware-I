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

// Refers to the table body from the html-document and inserts the code generated in the makeTableHTML-function.
document.getElementById("tbody").innerHTML = makeTableHTML(convertTableValues(route));

// Refers to the paragraph of the html-document and creates the output for the total length.
document.getElementById("totalLength").innerHTML = "Total length in meter: "+ round(calculateTotalDistance(route),2)+"m";