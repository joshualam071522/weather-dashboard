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

    function renderWeather() {
       var savedWeather = JSON.parse(localStorage.getItem(searchInputEl));
        cityEl.textContent = savedWeather.city;
        temperatureEl.textContent = 'Temp: ' + savedWeather.temperature + '° Fahrenheit ';
        windEl.textContent = 'Wind: ' + savedWeather.wind + ' mph';
        humidityEl.textContent = 'Humidity: ' + savedWeather.humidity + '%';  
    }

    //* Added conditional to check to render results if it is already in local storage
    if(localStorage.getItem(searchInputEl)) {
        console.log('found city in storage!');
        renderWeather(searchInputEl);
    } else {
        console.log('finding a city through API!')
        searchWeatherApi(searchInputEl)
    }

    //* fetch the weather api
    function searchWeatherApi (searchInputEl) {
        
        var weatherQueryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ searchInputEl +'&APPID=3e7fe8a93b7d45df7ddde9af30d1b389&units=imperial'
        
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
                renderWeather(searchInputEl);
            })
        }
    }
    

//TODO searchForecastAPI
//TODO render forecast function
searchFormEl.addEventListener('submit', SearchFormSubmitHandler);