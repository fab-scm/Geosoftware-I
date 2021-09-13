"use strict"

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

 
            // show the details as a bootstrap card
            //showDetailsAsCard(details)

            // show the details on a leaflet map 
            //showDetailsOnMap(details)

            return false // see https://css-tricks.com/return-false-and-prevent-default/
        }
})


// function showDetailsAsCard(details) {
//     let text = `The current selection is: <br> <br> POI Name: ${details[0].properties.poiname}, City Name:  ${details[0].properties.cityname}, Link:  <a href=" ${details[0].properties.link}"> ${details[0].properties.link}</a> `
//     //  console.log(details[0].properties)

//     // create a card element and fill it with information from the current poi
//     let cardbody = document.getElementById("information").children[0]
//     console.dir(cardbody)
//     // Title
//     cardbody.children[0].innerHTML = details[0].properties.poiname
//     // subtitle
//     cardbody.children[1].innerHTML = details[0].properties.cityname
//     //content
//     nearbyPlaces(details[0]).then(result => {
//         cardbody.children[2].innerHTML = result
//         console.trace("I am doing a test")
//     })
//     // link
//     cardbody.children[3].href = details[0].properties.link
//     cardbody.children[3].innerHTML = details[0].properties.link


// }