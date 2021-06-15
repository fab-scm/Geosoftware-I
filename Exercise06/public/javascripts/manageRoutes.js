"use strict"

// variables that store the 
var deleteButton = document.getElementById('deleteButton');


/**
 * 
 */
deleteButton.addEventListener('click', function(){
    var checkedRoutes = getCheckedRoutes();
    //deleteCheckedRoutes(checkedRoutes);
    var objectDataString = JSON.stringify(checkedRoutes);
    $.ajax({
        type: "POST",
        url: "/manageRoutes/delete",
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
})



/**
 * 
 * @returns 
 */
function getCheckedRoutes() {
    var obj = {};
    obj.routesChecked=[];

    $("input:checkbox").each(function(){
        var $this = $(this);

        if($this.is(":checked")){
            obj.routesChecked.push($this.attr("id"));
        }
    });
    console.log(obj);
    return obj;
}


/**
 * The function gets called everytime the Rename-Button of the in the DB stored
 * route is clicked.
 * 
 * @param {String} id 
 * @param {String} index 
 */
function renameRoute(id, index) {

    var obj = {};
    var text = document.getElementById(id + index).value;
    
    obj.id = id;
    obj.index = index;
    obj.newname = text;

    console.log(obj);

    var objectDataString = JSON.stringify(obj);
    console.log(objectDataString);
    $.ajax({
        type: "POST",
        url: "/manageRoutes/rename",
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