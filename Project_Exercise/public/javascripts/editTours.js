"use strict"

var checkboxTourArray = [];
var checkboxTourArrayNames = []

$(".chb").each(function() {

               $(this).change(function() {

                                $(this).attr('checked',true);
                                $(".chb").attr('checked',false);
                                if (this.checked == true) {
                                    checkboxTourArray.push(this.id);
                                    checkboxTourArrayNames.push(this.parentNode.nextSibling.innerHTML);
                                }
                                else {
                                const index = checkboxTourArray.indexOf(this.id);
                                if (index > -1) {
                                    checkboxTourArray.splice(index, 1);
                                    checkboxTourArrayNames.splice(index, 1);
                                }
                                }

                                if (checkboxTourArrayNames.length > 0) {
                                    var tourTableArray = '<tr><th>Position</th><th>Sehenswürdigkeiten</th></tr>' 
                                    for (let i = 0; i < checkboxTourArrayNames.length; i++) {
                                        tourTableArray += `<tr>\
                                                            <td>${i+1}</td>\
                                                            <td>${checkboxTourArrayNames[i]}</td>\
                                                            </tr>`
                                    }
                                    document.getElementById('tableTours').innerHTML = tourTableArray;
                                    document.getElementById('tourTable').style.display = 'block';
                                }
                                else {
                                    document.getElementById('tourTable').style.display = 'none';
                                }
                                
                                
                                

                            //   console.log(this.id);
                            //   console.log(this.checked);
                                console.log(checkboxTourArray);
                                console.log(checkboxTourArrayNames);
                              });
           });

var tourButton = document.getElementById('erstelleTourButton');

tourButton.addEventListener('click', function(){
    var tourObj = {}
    tourObj.items = checkboxTourArray;
    tourObj.name = document.getElementById('tourName').value;
    var tourObjString = JSON.stringify(tourObj)
    
    console.log(tourObj);

     // Ajax request to send sight data to server to upload it to the database
     $.ajax({
        async: "true",
        type: "POST",
        url: "/edit/addTour",
        //dataType: "json",
        data: {
            o: tourObjString
        },
        success: function (data) {
            alert("Die Tour wurde erfolgreich hinzugefügt und ist unter 'Stadttouren' einsehbar.")
            window.location.href = "/edit";
        },
        error: function () {
            alert('error')
        }
    })
    .done()
})