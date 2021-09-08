"use strict"

var checkbox = document.querySelector("input[type=checkbox]");

$('input[type=checkbox]').change(function() {
    //$(this).siblings('input[type="checkbox"]').prop('checked', false);
    $('input.chb').not(this).prop('checked', false);
    if (this.checked) {
        console.log(this.id);
        let tour = tours.find(x => x._id === this.id);
        console.log(tour);
        addSightsFromDB(tour.items);
    } else {
        console.log("Checkbox is not checked..");
    }
});

function isEqual(tour, id) {
    return tour._id === id;
}

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
  * and puts all ids of the checked boxes into one array which is stored as an js object.
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
