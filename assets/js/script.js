console.log("Entering script.js");
//Define some global variables
var lat = 60.99;
var lon = 30.9;
var city = "London";
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
var searchBtn = $('#search')


//Function to push the searchHistory from user input
//allows access to the city name when its clicked

//create a function to retrieve search history from local storage

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
            //TODO icon display
            //
            currentTempEl.text((response.main.temp - 273.15).toFixed(2));
            currentHumEl.text(response.main.humidity);
            currentWindEl.text(response.wind.speed);
            //TODO UV index
            lat = response.coord.lat;
            lon = response.coord.lon;
            console.log(lat + " " + lon);
            coordUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            getUVIndex(coordUrl);
        });
}


//create second api call to retrieve the 5 day forcast
//create variables to grab api response to be able to insert api data into second api

//function to get UV index and render to page
function getUVIndex(url){
    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function (response){
        console.log(response);
        currentUvEl.text(response.current.uvi);
    });
}

//create a handler to check search field and return data, if no data is in search field return;
function searchFieldHandler(){
    if($('#city').val()){
        return $('#city').val();
    }
    else{
        return;
    }
}

searchBtn.click(function(){
    if(searchFieldHandler()){
        city = searchFieldHandler();
        console.log(city);
        currentWeather();
    }
    else{
        console.log("No input");
    }
});