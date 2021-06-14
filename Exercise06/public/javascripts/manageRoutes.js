"use strict"

var renameButton = document.getElementById('renameButton');
var deleteButton = document.getElementById('deleteButton');

/*renameButton.addEventListener('click', function(){
    var checkedRoutes = getCheckedRoutes();
    //renameCheckedRoutes(checkedRoutes);
});*/



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


function deleteCheckedRoutes(checkedRoutes) {
    client.connect(function(err)
    {
        if (err) throw err;

        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        for (var i=0; i<checkedRoutes.length; i++){
            var myquery = { "_id": ObjectId(checkedRoutes[i])}
            collection.deleteOne(myquery, function(err, data)
            {
                if (err) throw err;
                console.log('One document deleted');
                db.close();
            })
        }
    })
}

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