const searchButtonEl = document.querySelector('#searchButton');
const recentSearchList = document.querySelector('#recentSearch');
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
                if (!response.ok) {
                    //TODO add modal saying cannot find city etc.
                    return;
                } else {
                    return response.json();
                }
            })
            .then (function (data) {
                if (!data) {
                    console.log('oops! data could not be found');
                    return;
                    //TODO add modal saying cannot find city etc.
                } else {
                    console.log(data);
                    renderForecast(data);
                }
            })
        }
    //* function to render forecast
    function renderForecast(data) {
        
        //* data returns array of 40 items back
        console.log(data.list);

        //* sets the innerhtml for forecast empty so it does not keep the previous search's forecast
        forecastEl.innerHTML = "";
        
        //* sets a for each for each item in the array
        data.list.forEach((item, index) => {
            //* sets if function so it does not render all 40 items in the array, only need 1 for each of the 5 days, not 8 for each
            if (index % 8 === 0) {
            //* creates html for each item
                forecastEl.innerHTML += 
                `<div class = "m-3 p-3">
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                    //* date constructor and to localeDateString method to format the date for each forecast
                    <h4>${new Date(item.dt * 1000).toLocaleDateString()}</h4>
                    <p>Temp: ${item.main.temp}°F</p>
                    <p>Humidity: ${item.main.humidity}%</p>
                    <p>Wind: ${item.wind.speed} mph</p>
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
                const storedCityName = storedCities[i];
                const storedCityBtn = document.createElement('Button');
                storedCityBtn.classList.add('btn', 'btn-secondary', 'w-75', 'm-1');
                storedCityBtn.append(storedCityName);
                recentSearchList.appendChild(storedCityBtn);

            }
        }
        //* runs display function when page loads instead of waiting for event listeners
        displayRecentSearch();
    

//TODO searchForecastAPI
//TODO render forecast function
//TODO add event listener for recent searches
searchFormEl.addEventListener('submit', function(event) {
    event.preventDefault();
    searchWeatherApi(searchInputEl.value.trim());
    searchForecastApi(searchInputEl.value.trim());
});