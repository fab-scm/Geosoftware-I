$("#routes").change(function() {
        var id = $("#routes option:selected").attr("id");
        $.ajax({
            type: "GET",
            url: "/selectRoute?id=" + id,
            //dataType: "json",
            success: function(){
                alert('success');
            },
            error: function(){
                alert('error')
            }
        })
        .done()
});

var button = document.getElementById('button');

/*$("routes").on('change', function () {
    alert($(this).find('option:selected').attr('id'));
});*/