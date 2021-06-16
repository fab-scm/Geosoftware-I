var submitButton = document.getElementById('submit');
var currentRoute = document.getElementById('currentRoute');

submitButton.addEventListener('click', function() {
    var id = $("#routes option:selected").attr("id");
    var name = $("#routes option:selected").attr("value");
    $.ajax({
        type: "POST",
        url: "/selectRoute",
        dataType: "text",
        data: {
            id: id
        },
        success: function(data){
            alert('success');
        },
        error: function(){
            alert('error')
        }
    }).done(window.location.href = "/")

    //document.getElementById(id).selected = 'selected'
    currentRoute.innerHTML(`Die aktuelle ausgewählte Route ist ${name}`)
});


/*$("#routes").change(function() {
        var id = $("#routes option:selected").attr("id");
        $.ajax({
            type: "POST",
            url: "/selectRoute",
            dataType: "text",
            data: {
                id: id
            },
            success: function(data){
                alert('success');
            },
            error: function(){
                alert('error')
            }
        })
});*/

//var button = document.getElementById('button');

/*$("routes").on('change', function () {
    alert($(this).find('option:selected').attr('id'));
});*/