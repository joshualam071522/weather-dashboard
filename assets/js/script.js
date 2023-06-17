const searchButtonEl = document.querySelector('#searchButton');
const recentSearchList = document.querySelector('#recentSearch');
const dateEl = document.querySelector('#date');
const cityEl = document.querySelector('#city');
const temperatureEl = document.querySelector('#temperature');
const windEl = document.querySelector('#wind');
const humidityEl = document.querySelector('#humidity');
const forecastEl = document.querySelector('#forecast');
const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('#searchInput')
const weatherDetailsList = document.querySelector('#weatherDetailsList');

//* local storage for recent searches. It will be empty array if there are no recent searches
const storedCities = JSON.parse(localStorage.getItem('city')) || [];

//* fetch the weather api
function searchWeatherApi (searchInput) {
    
    const weatherQueryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ searchInput +'&APPID=3e7fe8a93b7d45df7ddde9af30d1b389&units=imperial'
    
    fetch(weatherQueryURL)
        .then(function (response) {
            if (!response.ok) {
                return;
            } else {
                return response.json();
            }
        })
        .then (function (data) {
            if (!data) {
                console.log('oops!');
                return;

            } else {
                renderWeather(data);
            }
        })
    }

//* Renders the weather on the page
function renderWeather(data) {
    
    //* retrieves weather details using data from fetch
    dateEl.textContent = dayjs.unix(data.dt).format('M/DD/YY');
    cityEl.textContent = data.name;
    temperatureEl.textContent = 'Temperature: ' + data.main.temp + '°F ';
    windEl.textContent = 'Wind: ' + data.wind.speed + ' MPH';
    humidityEl.textContent = 'Humidity: ' + data.main.humidity + '%';
    
    //* creates weather icon and appends it next to city name;
    const weatherIconQuery = data.weather[0].icon;
    const weatherIconEl = document.createElement('img');
    weatherIconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + weatherIconQuery + '.png');
    weatherIconEl.setAttribute('alt', data.weather[0].description);
    document.getElementById('city').appendChild(weatherIconEl);
    
    //* passes in data to function that adds city to recent search
    addCityRecentSearch(data.name)
}

//* Fetches forecast API
function searchForecastApi (searchInput) {
    const forecastQueryUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+ searchInput +'&appid=3e7fe8a93b7d45df7ddde9af30d1b389&units=imperial'

    fetch(forecastQueryUrl)
        .then(function (response) {
            if (!response.ok) {                return;
            } else {
                return response.json();
            }
        })
        .then (function (data) {
            if (!data) {
                console.log('oops! data could not be found');
                return;
            } else {
                renderForecast(data);
            }
        })
    }

//* function to render forecast
function renderForecast(data) {

    //* sets the innerhtml for forecast empty so it does not keep the previous search's forecast
    forecastEl.innerHTML = "";
    
    //* sets a for each for each item in the array
    data.list.forEach((data, index) => {
        //* sets if function so it does not render all 40 items in the array, only need 1 for each of the 5 days, not 8 for each
        if (index % 8 === 0) {
        //* creates html for each item
            forecastEl.innerHTML += 
            `<div class="w-auto text-center m-3 p-3 border-secondary">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
                <h4><b>${dayjs(data.dt_txt).format('M/DD/YY')}</b></h4>
                <p><b>Temp: ${data.main.temp}°F</b></p>
                <p><b>Humidity: ${data.main.humidity}%</b></p>
                <p><b>Wind: ${data.wind.speed} MPH</b></p>
            </div>` 
        }
    })
}
function addCityRecentSearch(cityName) {
    
    //* Checks if index value is -1 because default value for error in indexOf method is -1
    //* Doing so prevents duplicate cities in the array
    const checkIndexOfCity = storedCities.indexOf(cityName);

    if (checkIndexOfCity !== -1) {
        storedCities.splice(checkIndexOfCity, 1);
    }

    //* pushes the city to the end of the array
    storedCities.unshift(cityName);

    //* checks if there are more than 8 cities. If so, will remove the first object of the array
    if (storedCities.length > 8) {
        storedCities.shift();
    }

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
        const storedCityName = storedCities[i];
        const storedCityBtn = document.createElement('Button');
        storedCityBtn.classList.add('btn', 'btn-light', 'w-75', 'm-1');
        storedCityBtn.innerHTML = storedCityName;
        recentSearchList.appendChild(storedCityBtn);

    }
}

//* function to show last searched city to render when loading the page again
function renderLastSearch() {
    if (storedCities.length < 1) {
        return;
    } else {
        searchWeatherApi(storedCities[0]);
        searchForecastApi(storedCities[0]);
    }
    
}

//* calls function to show last searched city
renderLastSearch();

//* runs display function when page loads instead of waiting for event listeners
displayRecentSearch();

searchFormEl.addEventListener('submit', function(event) {
    event.preventDefault();
    searchWeatherApi(searchInputEl.value.trim());
    searchForecastApi(searchInputEl.value.trim());
});

//* added event listener for recent search
recentSearchList.addEventListener('click', function (event){
    event.preventDefault();
    const recentSearchInput = event.target.textContent.toLowerCase();
    searchWeatherApi(recentSearchInput);
    searchForecastApi(recentSearchInput);
});


