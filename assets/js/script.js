var searchButtonEl = document.querySelector('#searchButton');
var recentSearchList = document.querySelector('#recentSearch');
var cityEl = document.querySelector('#city');
var temperatureEl = document.querySelector('#temperature');
var windEl = document.querySelector('#wind');
var humidityEl = document.querySelector('#humidity');
var forecastEl = document.querySelector('#forecast');
var searchFormEl = document.querySelector('#search-form');
var searchInputEl = document.querySelector('#searchInput')
var weatherDetailsList = document.querySelector('#weatherDetailsList');

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
                    return;
                    //TODO add modal saying cannot find city etc.
                } else {
                    console.log(data);
                    renderWeather(data);
                }
            })
        }

    //* Renders the weather on the page
    function renderWeather(data) {
        
        //* retrieves weather details using data from fetch
        cityEl.textContent = data.name;
        temperatureEl.textContent = 'Temp: ' + data.main.temp + '° Fahrenheit ';
        windEl.textContent = 'Wind: ' + data.wind.speed + ' mph';
        humidityEl.textContent = 'Humidity: ' + data.main.humidity + '%';
        
        //* creates weather icon and appends it next to city name;
        var weatherIconQuery = data.weather[0].icon;
        var weatherIconEl = document.createElement('img');
        weatherIconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + weatherIconQuery + '.png');
        weatherIconEl.setAttribute('alt', data.weather[0].description);
        document.getElementById('city').appendChild(weatherIconEl);
        
        //* passes in data to function that adds city to recent search
        addCityRecentSearch(data.name)
    }

        function addCityRecentSearch(cityName) {
            
            //* Checks if index value is -1 because default value for error in indexOf method is -1
            //* Doing so prevents duplicate cities in the array
            var checkIndexOfCity = storedCities.indexOf(cityName);
    
            if (checkIndexOfCity !== -1) {
                storedCities.splice(checkIndexOfCity, 1);
            }

            //* pushes the city to the end of the array
            storedCities.push(cityName);

            //* checks if there are more than 8 cities. If so, will remove the first object of the array
            if (storedCities.length > 8) {
                storedCities.shift();
            }
            //* checks if new array is only 5 cities long and searched city is at end of array
            console.log(storedCities)

            //* updates array in local storage
            localStorage.setItem('city', JSON.stringify(storedCities));
            //* runs display recent search so page updates to most recent search.
            displayRecentSearch();
        }

        function displayRecentSearch() {
            //* empties out recent searches list to prevent duplicates
            recentSearchList.innerHTML = '';

            //* creates a button with name of the city for each city in the local storage array
            for (let i = 0; i < storedCities.length; i++) {
                var storedCityName = storedCities[i];
                var storedCityBtn = document.createElement('Button');
                storedCityBtn.classList.add('btn', 'btn-secondary');
                storedCityBtn.append(storedCityName);
                recentSearchList.append(storedCityBtn);
            }
        }
        //* runs display function when page loads instead of waiting for event listeners
        displayRecentSearch();
    

//TODO searchForecastAPI
//TODO render forecast function
//TODO add event listener for recent searches
searchFormEl.addEventListener('submit', function(event) {
    event.preventDefault();
    searchWeatherApi(searchInputEl.value.trim())
});