"use strict"

var searchButton = document.getElementById('searchButton');

let tourNames = tours.map(function (data) {
    return data.name;
});
console.log(tourNames);

// autocomplete
$("#tours").autocomplete({
        minLength: 1, // start after 1 character
        source: tourNames, // take the poinames as source
        select: function (event, ui) {
            this.value = ui.item.value // update the value of the current field with the value of the selected element

            let details = tours.filter(function (el) {
                // return the only object for which the poiname matches the selection
                return el.name === ui.item.value
            })

            console.log(details);

            return false // see https://css-tricks.com/return-false-and-prevent-default/
        }
})


function clickSearch() {
    var searchInput = document.getElementById('tours').value;

    let details = tours.filter(function(el){
        return el.name === searchInput;
    })

    var tourCheckbox = document.getElementById(details[0]._id);
    tourCheckbox.checked = true;

    $('input[type=checkbox]').not(tourCheckbox).prop('checked', false);

    var tour = tours.find(x => x._id === tourCheckbox.id);
        console.log(tour);
        addSightsFromDB(tour.items);
        // Refers to the table body from the html-document and inserts the code generated in the makeTableHTML-function.
        table.innerHTML = makeTableHTML(fillContentTable(tour));
        tourSights.style.display = 'block';

        var tablerows = document.getElementsByClassName("tablerow");
        for (let i = 0; i < tablerows.length; i++) {
            tablerows[i].addEventListener('mouseover', function(e) {
                //console.log(this.id);
                markerFunctionOpen(this.id);
            })
        }  
        for (let i = 0; i < tablerows.length; i++) {
            tablerows[i].addEventListener('mouseout', function(e) {
                //console.log(this.id);
                markerFunctionClose(this.id);
            })
        }  
}

function resetSearchValue() {
    console.log(document.getElementById('sights').value);
    document.getElementById('sights').value = "";
}