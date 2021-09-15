"use strict"

var searchButton = document.getElementById('searchButton');

let sightNames = sights.map(function (data) {
    return data.features[0].properties.Name;
});

console.log(sightNames);

// autocomplete
$("#sights").autocomplete({
        minLength: 1, // start after 1 character
        source: sightNames, // take the poinames as source
        select: function (event, ui) {
            this.value = ui.item.value // update the value of the current field with the value of the selected element

            let details = sights.filter(function (el) {
                // return the only object for which the poiname matches the selection
                return el.features[0].properties.Name === ui.item.value
            })

            console.log(details);
            
            // document.getElementById(details[0]._id).checked = true;
            // markerFunctionOpen(details[0]._id);

            // show the details as a bootstrap card
            //showDetailsAsCard(details)

            // show the details on a leaflet map 
            //showDetailsOnMap(details)

            return false // see https://css-tricks.com/return-false-and-prevent-default/
        }
})

function clickSearch() {
    var searchInput = document.getElementById('sights').value;
    console.log(searchInput);

    let details = sights.filter(function(el){
        return el.features[0].properties.Name === searchInput;
    })

    markerFunctionOpen(details[0]._id);
}

function resetSearchValue() {
    console.log(document.getElementById('sights').value);
    document.getElementById('sights').value = "";
}