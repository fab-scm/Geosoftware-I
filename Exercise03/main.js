"use strict"

let buttonPosition = document.getElementById("buttonPosition");
let currentWeather = document.getElementById("currentWeather");
let currentPosition = document.getElementById("currentPosition")


/**
 * The function loads the weather at the given position
 * @param {*} latitude 
 * @param {*} longitude 
 */
function loadWeatherAtPosition(latitude, longitude) {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(this.responseText);
            console.log(res);

            let image = new Image();
            image.src = `http://openweathermap.org/img/wn/${res.current.weather[0].icon}@2x.png`

            showWeatherAtPosition(res, image);
        }
    }
    xhttp.open("GET", `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${openweatherAPIKey}`, true)
    xhttp.send() 
    
}


/**
 * 
 * @param {*} weatherData 
 * @param {*} weatherImage 
 */
function showWeatherAtPosition(weatherData, weatherImage) {
    let date = new Date(weatherData.current.dt*1000)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    console.log(date.toLocaleDateString('en-DE', options))

    currentWeather.style.display = "block";
    document.getElementById("date").innerHTML = "Date: " + date.toLocaleDateString('en-DE', options);
    document.getElementById("currentTemp").innerHTML = "Temperature: " + Math.round(weatherData.current.temp) + " °C";
    document.getElementById("feelsLikeTemp").innerHTML = "Feels-like: " + Math.round(weatherData.current.feels_like) + " °C";
    document.getElementById("currentWind").innerHTML = "Windspeed and direction: " + weatherData.current.wind_speed + " m/s, " + weatherData.current.wind_deg + " °";
    document.getElementById("currentHumidity").innerHTML = "Humidity: " + weatherData.current.humidity + " %";
    document.getElementById("currentClouds").innerHTML = "Cloudiness: " + weatherData.current.clouds + " %";
    document.getElementById("weatherImage").src = weatherImage.src;

}


/**
 * 
 * @param {*} latitude 
 * @param {*} longitude 
 */
function getCity(latitude, longitude) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(this.responseText);
            console.log(res);
            

            document.getElementById("cityName").innerHTML = res.features[2].place_name;
        }
    }
    xhr.open("GET", `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxAPIToken}`, true)
    xhr.send()
}



/**
 * 
 */
buttonPosition.addEventListener('click', function(){
    navigator.geolocation.getCurrentPosition(success, error);  
})


/**
 * 
 * @param {*} pos 
 */
function success(pos) {
    console.log(pos);
    var position = pos.coords;

    currentPosition.style.display = "block";
    document.getElementById("accuracy").innerHTML = `Accuracy:  ${position.accuracy}`;

    getCity(position.latitude, position.longitude);
    loadWeatherAtPosition(position.latitude, position.longitude);
}


function error() {
    alert("Error: User denied access to position")
}