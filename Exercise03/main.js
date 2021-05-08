function success(pos) {
    var position = pos.coords;

    document.getElementById("coordinates").innerHTML = `Coordinates (lat/lng): ( ${position.latitude}, ${position.longitude} )`;
    document.getElementById("accuracy").innerHTML = `Accuracy:  ${position.accuracy}`;

    loadWeatherAtPosition(position.latitude, position.longitude);
}




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
    xhttp.open("GET", `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=97bc8bb7723c267f11e85434445965a9`, true)
    xhttp.send()
    
}

function showWeatherAtPosition(weatherData, weatherImage) {
    let date = new Date(weatherData.current.dt*1000)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    console.log(date.toLocaleDateString('en-DE', options))

   
    document.getElementById("date").innerHTML = "Date: " + date.toLocaleDateString('en-DE', options);
    document.getElementById("currentTemp").innerHTML = "Temperature: " + weatherData.current.temp + " degree celcius";
    document.getElementById("feelsLikeTemp").innerHTML = "Feels-like: " + weatherData.current.feels_like + " degree celsius";
    document.getElementById("currentWind").innerHTML = "Windspeed and direction: " + weatherData.current.wind_speed + " m/s, " + weatherData.current.wind_deg + " degrees";
    document.getElementById("currentHumidity").innerHTML = "Humidity: " + weatherData.current.humidity + " %";
    document.getElementById("currentClouds").innerHTML = "Cloudiness: " + weatherData.current.clouds + " %";
    document.body.appendChild(weatherImage);

}

function error(error) {
    alert("Error: User denied access to position")
}

// navigator.geolocation.getCurrentPosition(success);


let buttonPosition = document.getElementById("buttonPosition")

buttonPosition.addEventListener('click', function(){
    let position = navigator.geolocation.getCurrentPosition(success, error);  
})