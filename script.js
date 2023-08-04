const cityInput = document.querySelector('.city-input');
const searchButton = document.querySelector('.search-button');
const locationButton = document.querySelector('.location-button');
const currentWeather = document.querySelector('.current-weather');
const weatherCards = document.querySelector('.weather-cards');
const API_KEY = '1b14398f85cb764a2c7d1eb7034f7798';
const createWeatherCard = (cityName,weatherItem,index) => {
     if(index === 0){
          return `
               <div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
               </div>
               <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
               </div>`;
     }else{
          return `
               <li class="card">
                    <h3>(${weatherItem.dt_txt.split(' ')[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} m/s</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
               </li>`;
     }
};
const getWeatherDetails = (cityName,latitude,longitude) => {
     const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
     fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
          const uniqueForecastDays = [];
          const fiveDaysForecast = data.list.filter(forecast => {
               const forecastDate = new Date(forecast.dt_txt).getDate();
               if(!uniqueForecastDays.includes(forecastDate)){
                    return uniqueForecastDays.push(forecastDate);
               }
          });
          cityInput.value = "";
          currentWeather.innerHTML = "";
          weatherCards.innerHTML = "";
          fiveDaysForecast.forEach((weatherItem,index) => {
               const html = createWeatherCard(cityName,weatherItem,index);
               if(index === 0){
                    currentWeather.insertAdjacentHTML('beforeend',html);
               }else{
                    weatherCards.insertAdjacentHTML('beforeend',html);
               }
          });
     }).catch(() => {
          alert('an error occurred while fetching the weather forecast!');
     });
};
const getCityCoordinates = () => {
     const cityName = cityInput.value.trim();
     if(cityName === "") return;
     const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
     fetch(API_URL).then(response => response.json()).then(data => {
          if(!data.length) return alert(`no coordinates found for ${cityName}`);
          const {lat,lon,name} = data[0];
          getWeatherDetails(name,lat,lon);
     }).catch(() => {
          alert('an error occurred while fetching the coordinates!');
     });
};
const getUserCoordinates = () => {
     navigator.geolocation.getCurrentPosition(position => {
          const {latitude,longitude} = position.coords;
          const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
          fetch(API_URL).then(response => response.json()).then(data => {
               const {name} = data[0];
               getWeatherDetails(name,latitude,longitude);
          }).catch(() => {
               alert('an error occurred while fetching the city name!');
          });
     },error => {
          if(error.code === error.PERMISSION_DENIED){
               alert('geolocation request denied. please reset location permission to grant access');
          }else{
               alert('geolocation request error. please reset location permission.')
          }
     });
};
locationButton.addEventListener('click',getUserCoordinates);
searchButton.addEventListener('click',getCityCoordinates);
cityInput.addEventListener('keyup',event => event.key === 'Enter' && getCityCoordinates());