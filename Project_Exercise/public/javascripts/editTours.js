"use strict"


//var checkbox = document.querySelector("input[type=checkbox]");

/*$('chb').addEventListener('change', function() {
  if (this.checked) {
    console.log("Checkbox is checked..");
  } else {
    console.log("Checkbox is not checked..");
  }
});*/

var checkboxTourArray = [];

$(".chb").each(function()
           {
               $(this).change(function()
                              {
                                  $(this).attr('checked',true);
                                  $(".chb").attr('checked',false);
                                  if (this.checked == true) {
                                      checkboxTourArray.push(this.id);
                                  }
                                  else {
                                    const index = checkboxTourArray.indexOf(this.id);
                                    if (index > -1) {
                                      checkboxTourArray.splice(index, 1);
                                    }
                                  }
                                  console.log(this.id);
                                  console.log(this.checked);
                                  console.log(checkboxTourArray);
                              });
           });

var tourButton = document.getElementById('erstelleTourButton');

tourButton.addEventListener('click', function(){
    //var tourObj = {}
    //tourObj.i = checkboxTourArray;
    //tourObj.name = document.getElementById('tourName').value;
    
    //console.log(tourObj);

     // Ajax request to send sight data to server to upload it to the database
     $.ajax({
        type: "POST",
        url: "/edit/addTour",
        data: {
            name: document.getElementById('tourName').value,
            items: checkboxTourArray
        },
        success: function (data) {
            window.location.href = "/edit";
        },
        error: function () {
            alert('error')
        }
    })
    .done()
})

