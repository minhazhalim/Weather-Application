const apiKey = "3265874a2c77ae4a04bb96236a642d2f";
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const url = (city) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
function KtoC(K){
     return Math.floor(K - 273.15);
}
function addWeatherToPage(data){
     const temperature = KtoC(data.main.temp);
     const weather = document.createElement('div');
     weather.classList.add('weather');
     weather.innerHTML = `
          <h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /> ${temperature}°C <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /></h2>
          <small>${data.weather[0].main}</small>
     `;
     main.innerHTML = "";
     main.appendChild(weather);
}
async function getWeatherByLocation(city){
     const response = await fetch(url(city),{origin: 'cors'});
     const responseData = await response.json();
     addWeatherToPage(responseData);
}
form.addEventListener('submit',(event) => {
     event.preventDefault();
     const city = search.value;
     if(city) getWeatherByLocation(city);
});