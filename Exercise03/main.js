"use strict"


// The HTML object saved in variables to use the multiple times
let buttonPosition = document.getElementById("buttonPosition");
let currentWeather = document.getElementById("currentWeather");
let currentPosition = document.getElementById("currentPosition")


/**
 * EventListener that checks for a click event and executes a function thhat asks the user to get access to the
 * browser loction. If the user accepts the success function will be executed and if the user denies the erreor function
 * will be executed
 * 
 * @param {string} type - the type of the event listened to
 * @param {EventListener} listener - function to call when the event is triggered
 */
 buttonPosition.addEventListener('click', function(){
    navigator.geolocation.getCurrentPosition(success, error);  
})


/**
 * Succes function which will be executed when the user accepts acces to the location.
 * 
 * @param {object} pos 
 */
function success(pos) {

    // variable that holds the coordinates of the browser location
    var position = pos.coords;                      

    // call the functions that display the weather and location information
    getCity(position);
    loadWeatherAtPosition(position.latitude, position.longitude);

    // makes everything visible
    currentPosition.style.display = "block"; 
    currentWeather.style.display = "block";      
}


/**
 * Error function which will be executed when the user denies acces to the location.
 * 
 */
function error() {
    alert("Error: User denied access to position")
}


/**
 * The function loads the weather data at the given position by making an XMLHttpRequest.
 * The XHR gets the data from the openweathermap API. Therefore the function accepts the latitude and longitude
 * of the current browser position and uses it for the XHRequest
 *  
 * @param {float} latitude - latitude coordinate usually in WGS84
 * @param {float} longitude - longitude coordinate usually in WGS84
 */
function loadWeatherAtPosition(latitude, longitude) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {                             // if the state of the request changes the function is executed
        if (this.readyState == 4 && this.status == 200) {               // if request was successfull
            let res = JSON.parse(this.responseText);                    // parse the json response-text returned by the server
            console.log(res);

            let image = new Image();                                    // create new Image-object
            image.src = `http://openweathermap.org/img/wn/${res.current.weather[0].icon}@2x.png` // let the src of the image object be the current weather symbol provided by openweather

            showWeatherAtPosition(res, image);                          // calls the function which fills the HTML document with all the necessary information
        }
    }
    xhttp.open("GET", `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${openweatherAPIKey}`, true)
    xhttp.send() 
}


/**
 * The function fills the HTML document with all the necessary information about the current weather, position and time.
 * Date is provided by creating a new Date-object with the unix time provided by the openweather-API.
 * It gets converted to a string with the toLocaleDateString()-function
 * 
 * @param {object} weatherData - the weather data accessed as JSON-object
 * @param {image} weatherImage - the weather image accessed as png
 */
function showWeatherAtPosition(weatherData, weatherImage) {

    // craete date-object and define the 
    let date = new Date(weatherData.current.dt*1000)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    //console.log(date.toLocaleDateString('en-DE', options))

    // filling the HTML-elements with information about date and weather
    document.getElementById("date").innerHTML = "Date: " + date.toLocaleDateString('en-EN', options);
    document.getElementById("weatherImage").src = weatherImage.src;
    document.getElementById("weatherDescription").innerHTML = weatherData.current.weather[0].description;
    document.getElementById("currentTemp").innerHTML = "Temperature: " + Math.round(weatherData.current.temp) + "°C";
    document.getElementById("feelsLikeTemp").innerHTML = "Feels-like: " + Math.round(weatherData.current.feels_like) + "°C";
    document.getElementById("currentWind").innerHTML = "Windspeed and direction: " + weatherData.current.wind_speed + " m/s , " + weatherData.current.wind_deg + "°";
    document.getElementById("currentHumidity").innerHTML = "Humidity: " + weatherData.current.humidity + " %";
    document.getElementById("currentClouds").innerHTML = "Cloudiness: " + weatherData.current.clouds + " %";
    
    
}


/**
 * The function gets a readable loaction description for the provided coordinates by making an XMLHttpRequest.
 * The function accepts the longitude and latitude and gets the district, city, state and country of the location
 * trough the mapbox reverse geocoding API.
 * 
 * @param {float} latitude - latitude coordinate usually in WGS84
 * @param {float} longitude - longitude coordinate usually in WGS84
 */
function getCity(position) {
    var xhr = new XMLHttpRequest()                                  
    xhr.onreadystatechange = function() {                           // if the state of the request changes the function is executed
        if (this.readyState == 4 && this.status == 200) {           // if request was successfull
            let res = JSON.parse(this.responseText);                // parse the json response-text returned by the server
            let readableLacation = res.features[2].place_name;      // save the readable location description in a variable
            console.log(res);
            
            // fills the city name paragraph with a readable descriptionn of the location
            document.getElementById("cityName").innerHTML = readableLacation;

            // fills the html-paragraph accuracy with the information about the accuracy of the localisation
            document.getElementById("accuracy").innerHTML = `Accuracy:  ${position.accuracy} m`;
        }
    }
    xhr.open("GET", `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.longitude},${position.latitude}.json?access_token=${mapboxAPIToken}`, true)
    xhr.send()
}