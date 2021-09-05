"use strict"

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