import axios from 'axios';
function parseCurrentWeather({current_weather,daily}){
     const {temperature: currentTemperature,windSpeed: windSpeed,weatherCode: iconCode} = current_weather;
     const {temperature_2m_maximum: [maxTemp],temperature_2m_minimum: [minTemp],apparent_temperature_maximum: [maxFeelsLike],apparent_temperature_minimum: [minFeelsLike],precipitation_summation: [precip]} = daily;
     return {
          currentTemperature: Math.round(currentTemperature),
          highTemperature: Math.round(maxTemp),
          lowTemperature: Math.round(minTemp),
          highFeelsLike: Math.round(maxFeelsLike),
          lowFeelsLike: Math.round(minFeelsLike),
          windSpeed: Math.round(windSpeed),
          precip: Math.round(precip * 100) / 100,
          iconCode,
     }
}
function parseDailyWeather({daily}){
     return daily.time.map((time,index) => {
          return {
               timeStamp: time * 1000,
               iconCode: daily.weatherCode[index],
               maximumTemperature: Math.round(daily.temperature_2m_maximum[index]),
          }
     });
}
function parseHourlyWeather({hourly,current_weather}){
     return hourly.time.map((time,index) => {
          return {
               timeStamp: time * 1000,
               iconCode: hourly.weatherCode[index],
               temperature: Math.round(hourly.temperature_2m[index]),
               feelsLike: Math.round(hourly.apparent_temperature[index]),
               windSpeed: Math.round(hourly.windSpeed_10m[index]),
               precip: Math.round(hourly.precipitation[index] * 100) / 100,
          }
     }).filter(({timeStamp}) => timeStamp >= current_weather.time * 1000);
}
export function getWeather(latitude,longitude,timezone){
     return axios.get('https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime',{
          params: {
               latitude: latitude,
               longitude: longitude,
               timezone,
          },
     }).then(({data}) => {
          return {
               current: parseCurrentWeather(data),
               daily: parseDailyWeather(data),
               hourly: parseHourlyWeather(data),
          }
     });
}