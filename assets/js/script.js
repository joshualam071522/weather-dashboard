var searchButtonEl = document.querySelector('#searchButton');
var recentSearchEl = document.querySelector('#recentSearch');
var cityEl = document.querySelector('#city');
var temperatureEl = document.querySelector('#temperature');
var windEl = document.querySelector('#wind');
var humidityEl = document.querySelector('#humidity');
var forecastEl = document.querySelector('#forecast');
var searchFormEl = document.querySelector('#search-form');

function SearchFormSubmitHandler(event) {
    //* stops default action of submitting
    event.preventDefault();

    //* retrieves input from user
    var searchInputEl = document.querySelector('#searchInput').value.toLowerCase().trim();

    //TODO add conditional to check to render results if it is already in local storage

    //* fetch the weather api
    function searchWeatherApi () {
        weatherQueryURL = 'https://api.openweathermap.org/data/2.5/weather?q=&APPID=3e7fe8a93b7d45df7ddde9af30d1b389';

        if (searchInputEl) {
            weatherQueryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ searchInputEl +'&APPID=3e7fe8a93b7d45df7ddde9af30d1b389&units=imperial'
            
            fetch(weatherQueryURL)
                .then(function (response) {
                    if (!response.ok) {
                        console.log("error!!!hehe")
                    }

                    return response.json();
                })

                .then (function (weatherResults) {
                    console.log(weatherResults);

                    //* store weather details into localStorage
                    var weatherDetails = {
                        city: weatherResults.name,
                        temperature: weatherResults.main.temp,
                        wind: weatherResults.wind.speed,
                        humidity: weatherResults.main.humidity
                    }

                    localStorage.setItem(searchInputEl, JSON.stringify(weatherDetails));
                    
                    //* Show weather details from local storage
                    function renderWeather() {
                        localStorage.getItem(searchInputEl);
                        cityEl.textContent = weatherDetails.city;
                        temperatureEl.textContent = 'Temp: ' + weatherDetails.temperature + '° Fahrenheit ';
                        windEl.textContent = 'Wind: ' + weatherDetails.wind + ' mph';
                        humidityEl.textContent = 'Humidity: ' + weatherDetails.humidity + '%';  
                    }

                    renderWeather(searchInputEl);
                })  
            
        }
    }
    
    //TODO searchForecastAPI
    searchWeatherApi(searchInputEl);
}


//TODO render forecast function
searchFormEl.addEventListener('submit', SearchFormSubmitHandler);