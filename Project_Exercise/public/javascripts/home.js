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