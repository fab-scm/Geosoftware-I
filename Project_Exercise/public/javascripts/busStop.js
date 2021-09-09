var busstopObj;

$.ajax({
    url: 'https://rest.busradar.conterra.de/prod/haltestellen',
    method: "GET",
    success: function(data){
        busstopObj = data;
        console.log(busstopObj);
    },
    error: function () {
        alert('error')
    }
})
.done()