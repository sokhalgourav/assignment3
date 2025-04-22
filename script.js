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
          // Set weather icon
          currentIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">`;
        
          // Show current weather section
          currentWeather.style.display = 'flex';
      }
      
      // Display 5-day forecast
      function displayForecast(data) {
          // Clear previous forecast
          forecastContainer.innerHTML = '';
          
          // We get forecast for every 3 hours (8 per day), so we'll take one at noon each day
          const forecasts = data.list.filter(item => {
              const date = new Date(item.dt * 1000);
              return date.getHours() === 12; // Get noon forecast for each day
          }).slice(0, 5); // Limit to 5 days
          
          if (forecasts.length === 0) {
              showError('No forecast data available');
              return;
          }
          
          forecasts.forEach(forecast => {
              const { dt, main, weather } = forecast;
              const { temp_max, temp_min } = main;
              const { description, icon } = weather[0];
              
              const date = new Date(dt * 1000);
              
              const forecastCard = document.createElement('div');
              forecastCard.className = 'forecast-card';
              
              forecastCard.innerHTML = `
                  <h3>${date.toLocaleDateString('en-US', { weekday: 'short' })}</h3>
                  <p>${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <div class="forecast-icon">
                      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
                  </div>
                  <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
                  <p>H: ${Math.round(temp_max)}°C</p>
                  <p>L: ${Math.round(temp_min)}°C</p>
              `;
              
              forecastContainer.appendChild(forecastCard);
          });
      }
      
      function hideError() {
          errorMessage.style.display = 'none';
      }
      
      // Initialize with a default city
      cityInput.value = 'London';
      fetchWeather();