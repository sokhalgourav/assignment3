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
  