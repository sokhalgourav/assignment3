const API_KEY = '6237d5ad2c111c067627b2e0703fc34d';

        
    // DOM Elements
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const errorMessage = document.getElementById('error-message');
    const currentWeather = document.getElementById('current-weather');
    const cityName = document.getElementById('city-name');
    const currentDate = document.getElementById('current-date');
    const currentTemp = document.getElementById('current-temp');
    const currentDesc = document.getElementById('current-desc');
    const currentDetails = document.getElementById('current-details');
    const currentIcon = document.getElementById('current-icon');
    const forecastContainer = document.getElementById('forecast-container');
    
    // Event Listeners
    searchBtn.addEventListener('click', fetchWeather);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fetchWeather();
        }
    });
    
    // Fetch weather data
    function fetchWeather() {
        const city = cityInput.value.trim();
        
        if (!city) {
            showError('Please enter a city name');
            return;
        }
       // Clear previous error
       hideError();
        
       // Fetch current weather
       fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
           .then(response => {
               if (!response.ok) {
                   throw new Error('City not found');
               }
               return response.json();
           })
           .then(data => {
               displayCurrentWeather(data);
               // Fetch forecast after current weather is displayed
               return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
           })
           .then(response => {
               if (!response.ok) {
                   throw new Error('Forecast not available');
               }
               return response.json();
           })
           .then(data => {
               displayForecast(data);
           })
           .catch(error => {
               showError(error.message);
           });
   }
    // Display current weather
 function displayCurrentWeather(data) {
     const { name, sys, main, weather, wind, dt } = data;
     const { country } = sys;
     const { temp, humidity, feels_like } = main;
     const { description, icon } = weather[0];
     const { speed } = wind;
     
     const date = new Date(dt * 1000);
     
     cityName.textContent = `${name}, ${country}`;
     currentDate.textContent = date.toLocaleDateString('en-US', { 
         weekday: 'long', 
         year: 'numeric', 
         month: 'long', 
         day: 'numeric' 
     });
     currentTemp.textContent = `${Math.round(temp)}°C (Feels like ${Math.round(feels_like)}°C)`;
     currentDesc.textContent = description.charAt(0).toUpperCase() + description.slice(1);
     currentDetails.textContent = `Humidity: ${humidity}% | Wind: ${speed} m/s`;
     