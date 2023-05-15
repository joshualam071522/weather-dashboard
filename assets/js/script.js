var searchButtonEl = document.querySelector('#searchButton');
var recentSearchEl = document.querySelector('#recentSearch');
var cityEl = document.querySelector('#city');
var temperatureEl = document.querySelector('#temperature');
var windEl = document.querySelector('#wind');
var humidityEl = document.querySelector('#humidity');
var forecastEl = document.querySelector('#forecast');
var searchFormEl = document.querySelector('#search-form');
var searchInputEl = document.querySelector('#searchInput')

//* local storage for recent searches. It will be empty array if there are no recent searches
var storedCities = JSON.parse(localStorage.getItem('city')) || [];

    //* fetch the weather api
    function searchWeatherApi (searchInput) {
        
        var weatherQueryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ searchInput +'&APPID=3e7fe8a93b7d45df7ddde9af30d1b389&units=imperial'
        
        fetch(weatherQueryURL)
            .then(function (response) {
                if (!response.ok) {
                    //TODO add modal saying cannot find city etc.
                    return;
                } else {
                    return response.json();
                }
            })
            .then (function (data) {
                if (!data) {
                    console.log('oops!');
                } else {
                    console.log(data);
                    renderWeather(data);
                }
            })
        }

         //* renders weather on website
    function renderWeather(data) {

        cityEl.textContent = data.name;
        temperatureEl.textContent = 'Temp: ' + data.main.temp + '° Fahrenheit ';
        windEl.textContent = 'Wind: ' + data.wind.speed + ' mph';
        humidityEl.textContent = 'Humidity: ' + data.main.humidity + '%';
        
        addCityRecentSearch(data.name)
    }

        function addCityRecentSearch(cityName) {
            var checkIndexOfCity = storedCities.indexOf(cityName);
            if (checkIndexOfCity !== -1) {
                storedCities.splice(checkIndexOfCity, 1);
            }

            storedCities.push(cityName);

            if (storedCities.length > 8) {
                storedCities.shift();
            }
            //* checks if new array is only 5 cities long and searched city is at end of array
            console.log(storedCities)
            localStorage.setItem('city', JSON.stringify(storedCities));
            displayRecentSearch();
        }

        function displayRecentSearch() {
            recentSearchEl.innerHTML = '';

            for (let i = 0; i < storedCities.length; i++) {
                var storedCityName = storedCities[i];
                var storedCityBtn = document.createElement('Button');
                storedCityBtn.classList.add('btn', 'btn-secondary');
                storedCityBtn.append(storedCityName);
                recentSearchEl.append(storedCityBtn);
            }
        }
        displayRecentSearch();
    

//TODO searchForecastAPI
//TODO render forecast function
searchFormEl.addEventListener('submit', function(event) {
    event.preventDefault();
    searchWeatherApi(searchInputEl.value.trim())
});