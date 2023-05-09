var searchButtonEl = document.querySelector('#searchButton');
var recentSearchEl = document.querySelector('#recentSearch');
var cityEl = document.querySelector('#city');
var temperatureEl = document.querySelector('#temperature');
var windEl = document.querySelector('#wind');
var humidityEl = document.querySelector('#humidity');
var forecastEl = document.querySelector('#forecast');
var searchFormEl = document.querySelector('#search-form');

function SearchFormSubmitHandler(event) {
    event.preventDefault();
    var searchInputEl = document.querySelector('#searchInput').value;
    console.log(searchInputEl);

    function searchWeatherApi () {
        weatherQueryURL = 'https://api.openweathermap.org/data/2.5/weather?q=&APPID=3e7fe8a93b7d45df7ddde9af30d1b389';

        if (searchInputEl) {
            weatherQueryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ searchInputEl +'&APPID=3e7fe8a93b7d45df7ddde9af30d1b389'
            
            console.log(weatherQueryURL);
            
            fetch(weatherQueryURL)
                .then(function (response) {
                    if (!response.ok) {
                        console.log("error!!!hehe")
                    }

                    return response.json();
                })
                .then(function (weatherResults) {
                    console.log(weatherResults);
                    cityEl.textContent = weatherResults.name;
                    temperatureEl.textContent = 'Temp: ' + weatherResults.main.temp + 'degrees?';
                    windEl.textContent = 'Wind: ' + weatherResults.wind.speed + ' mph';
                    humidityEl.textContent = 'Humidity: ' + weatherResults.main.humidity + '%';
                    
                })
        }
    }
    searchWeatherApi(searchInputEl);
}

searchFormEl.addEventListener('submit', SearchFormSubmitHandler);