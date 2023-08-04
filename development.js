import './design.css';
import {getWeather} from './weather.js';
import {icon_map} from './iconMap.js';
const currentIcon = document.querySelector('[data-current-icon]');
const dailySection = document.querySelector('[data-day-section]');
const hourlySection = document.querySelector('[data-hour-section]');
const dayCardTemplate = document.getElementById('day-card-template');
const hourRowTemplate = document.getElementById('hour-row-template');
const day_formatter = new Intl.DateTimeFormat(undefined,{weekday: 'long'});
const hour_formatter = new Intl.DateTimeFormat(undefined,{hour: 'numeric'});
function setValue(selector,value,{parent = document} = {}){
     parent.querySelector(`[data-${selector}]`).textContent = value;
}
function getIconUrl(iconCode){
     return `./icons/${icon_map.get(iconCode)}.svg`;
}
function renderCurrentWeather(current){
     currentIcon.src = getIconUrl(current.iconCode);
     setValue('current-temp',current.currentTemp);
     setValue('current-high',current.highTemp);
     setValue('current-low',current.lowTemp);
     setValue('current-fl-high',current.highFeelsLike);
     setValue('current-fl-low',current.lowFeelsLike);
     setValue('current-wind',current.windSpeed);
     setValue('current-precip',current.precip);
}
function renderDailyWeather(daily){
     dailySection.innerHTML = "";
     daily.forEach(day => {
          const element = dayCardTemplate.content.cloneNode(true);
          setValue('temp',day.maxTemp,{parent: element});
          setValue('date',day_formatter.format(day.timestamp),{parent: element});
          element.querySelector('[data-icon]').src = getIconUrl(day.iconCode);
          dailySection.append(element);
     });
}
function renderHourlyWeather(hourly){
     hourlySection.innerHTML = "";
     hourly.forEach(hour => {
          const element = hourRowTemplate.content.cloneNode(true);
          setValue('temp',hour.temp,{parent: element});
          setValue('fl-temp',hour.feelsLike,{parent: element});
          setValue('wind',hour.windSpeed,{parent: element});
          setValue('precip',hour.precip,{parent: element});
          setValue('day',day_formatter.format(hour.timestamp),{parent: element});
          setValue('time',hour_formatter.format(hour.timestamp),{parent: element});
          element.querySelector('[data-icon]').src = getIconUrl(hour.iconCode);
          hourlySection.append(element);
     });
}
function renderWeather({current,daily,hourly}){
     renderCurrentWeather(current);
     renderDailyWeather(daily);
     renderHourlyWeather(hourly);
     document.body.classList.remove('blurred');
}
function positionSuccess({coords}){
     getWeather(coords.latitude,coords.longitude,Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather).catch(error => {
          alert('Error Getting Weather',error);
     });
}
function positionError(){
     alert('There was an Error Getting Your Location. Please Allow Us to Use Your Location and Refresh the Page.')
}
navigator.geolocation.getCurrentPosition(positionSuccess,positionError);