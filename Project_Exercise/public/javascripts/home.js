"use strict"
let table = document.getElementById("table");
var checkbox = document.querySelector("input[type=checkbox]");

$('input[type=checkbox]').change(function() {
    $('input.chb').not(this).prop('checked', false);
    if (this.checked) {
        let tour = tours.find(x => x._id === this.id);
        addSightsFromDB(tour.items);
        // Refers to the table body from the html-document and inserts the code generated in the makeTableHTML-function.
        table.innerHTML = makeTableHTML(fillContentTable(tour));
        table.style="display: block;";
    } else {
        map.removeLayer(markers);
        markers = new L.FeatureGroup();
        table.style="display: none;";
    }
});

// variables that store the delete-Button HTML-object
var deleteButton = document.getElementById('deleteTourButton');

/**
 * Event-listener that listens for a click event on the deleteButton. 
 * If the button is clicked the callback function is executed which sends 
 * an ajax-POST-request to the express server. 
 * The data sent to the server contains the id's of the routes which should be deleted from the database.
 * After the ajax-request is done the page gets refreshed.
 */
deleteButton.addEventListener('click', function(){
   var checkedTours = getCheckedTours();
   if (checkedTours.toursChecked.length != 0){
       var objectDataString = JSON.stringify(checkedTours);
       // Ajax request that sends information about the sights that should be deleted from the database to the server.
       $.ajax({
           async: false,
           type: "POST",
           url: "/home/delete",
           data: {
               o: objectDataString
           },
           success: function (data) {
               window.location.href = "/home"
           },
           error: function () {
               alert('error')
           }
       })
       .done()
   }
})

/**
  * The function iterates through all HTML-objects from type input:checkbox
  * and puts all ids of the checked boxes into one array which is stored as an js object. Only one box can be checked at the same time, so 
  * the length of the array is <=1.
  * 
  * @returns {object} the object that contains an array with the ids of all the checked boxes in the HTML-document
  */
 function getCheckedTours() {
    var obj = {};
    obj.toursChecked=[];
    
    $("input:checkbox").each(function(){
        var $this = $(this);

        if($this.is(":checked")){
            obj.toursChecked.push($this.attr("id"));
        }
    });
    return obj;
 }

 /**
 * The function creates HTML-Code to generate a table out of a two-dimensional array
 * that can be pasted into an HTML document afterwards.
 * 
 * @param {2D array} myArray 
 * @returns -  a String of the generated HTML-Code
 */
 function makeTableHTML(myArray) {

    var result = "<table border=1><tr><th>#</th><th>Name</th><th>URL</th>";
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
  * The function fills the array contentTable with the right information:
  * first column: index of the sight
  * second column: name of the sight
  * third column: url of the sight
  *  
  * @param {geojson} tour - geojson object of a tour with its name and sights...
  */
 function fillContentTable(tour){
     
    let tableData = [];     // Array that gets filled with the content for the table shown on the HTML page
    for (let i = 0; i < tour.items.length; i++) {
        var tableColumn = [];
        tableColumn[0] = i + 1;
        tableColumn[1] = tour.items[i].features[0].properties.Name;
        tableColumn[2] = tour.items[i].features[0].properties.URL;;
        
        tableData.push(tableColumn);
    }
    return tableData;
}