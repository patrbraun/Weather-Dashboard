console.log("Entering script.js");
//Define some global variables
var lat = 60.99;
var lon = 30.9;
var city = "";
// searchHistory as an array 
var searchHistory = [];
//api key
var apiKey = "f79264eb8fdf015d3fa45a9a4e917dba"
//api url
var coordUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
var nameUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
//Reference DOM elements 
var currentNameEl = $('#currentName');
var currentDateEl = $('#currentDate');
var currentTempEl = $('#currentTemp');
var currentHumEl = $('#currentHum');
var currentWindEl = $('#currentWind');
var currentUvEl = $('#currentUV')
var currentUvIcon = $('#uvColor');
var searchBtn = $('#search')
var currentIcon = $('#currentIcon');


//create a function to retrieve search history from local storage
function getHistory() {
    if (localStorage.getItem('search-history')) {
        searchHistory = JSON.parse(localStorage.getItem('search-history'));
    }
}

//Function to push the searchHistory from user input
//allows access to the city name when its clicked
function pushHistory() {
    $('#history').empty();
    getHistory();
    if (city) {
        searchHistory.push(city);
    }
    searchHistory.forEach(function (element) {
        var historyBtn = $('<button>').text(element).click(function () {
            city = element;
            currentWeather();
        })
        $('#history').append(historyBtn)
    })
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
}

//function to display the current weather data and append information the the page
function currentWeather() {
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    console.log(url);
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            //Dispay current weather data 
            currentNameEl.text(response.name);
            currentDateEl.text(moment.unix(response.dt).format("MMMM/DD/YYYY"));
            var iconUrl = "http://openweathermap.org/img/wn/"+ response.weather[0].icon +".png";
            console.log(iconUrl);
            currentIcon.attr("src", iconUrl);

            currentTempEl.text((response.main.temp - 273.15).toFixed(2));
            currentHumEl.text(response.main.humidity);
            currentWindEl.text(response.wind.speed);
            //TODO UV index
            lat = response.coord.lat;
            lon = response.coord.lon;
            coordUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            getUVIndex(coordUrl);
        });
}


//function to get UV index and render to page
function getUVIndex(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            var uvIndex = response.current.uvi;
            currentUvIcon.css("color","white")
            if(uvIndex <= 2){
                currentUvIcon.css("background-color","green").text("Low");
            }else if(uvIndex <= 5){
                currentUvIcon.css("background-color","yellow").text("Moderate");
            }else if(uvIndex <= 7){
                currentUvIcon.css("background-color","orange").text("High");
            }else if(uvIndex <= 10){
                currentUvIcon.css("background-color","red").text("Very High");
            }else{
                currentUvIcon.css("background-color","violet").text("Extreme");
            }
            currentUvEl.text(response.current.uvi);
            //Create five day forecast
            for (i = 0; i < 5; i++) {
                var card = "day-" + i;
                document.getElementById(card).children[0].innerHTML= moment.unix(response.daily[i].dt).format("MMMM/DD/YYYY");
                var fiveIconUrl = "http://openweathermap.org/img/wn/"+ response.daily[i].weather[0].icon +".png";
                document.getElementById(card).children[1].children[0].src= fiveIconUrl;
                document.getElementById(card).children[2].innerHTML= "Temp: " + (response.daily[i].temp.day - 273.15).toFixed(2) + " C";
                document.getElementById(card).children[3].innerHTML= "Humididty: " + response.daily[i].humidity + "%";
                document.getElementById(card).children[4].innerHTML= "Wind Speed: " + response.daily[i].wind_speed + " metre/sec";
            }
        });
}

//create a handler to check search field and return data, if no data is in search field return;
function searchFieldHandler() {
    if ($('#city').val()) {
        return $('#city').val();
    }
    else {
        return;
    }
}

searchBtn.click(function () {
    if (searchFieldHandler()) {
        city = searchFieldHandler();
        pushHistory();
        console.log(city);
        currentWeather();
    }
    else {
        console.log("No input");
    }
});

pushHistory();