const wrapper = document.querySelector(".wrapper");
const inputPart = document.querySelector(".input-part");
const infoTxt = inputPart.querySelector(".info-txt");
const inputField = inputPart.querySelector("input");
const locationButton = inputPart.querySelector("button");
const weatherPart = wrapper.querySelector(".weather-part");
const weatherIcon = weatherPart.querySelector("img");
const arrowBack = wrapper.querySelector("header i");
const API_KEY = 'b1a8768dbe7b1a471d3b9bb04e4f294b';
let api;
function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description,id} = info.weather[0];
        const {temp,feels_like,humidity} = info.main;
        if(id == 800){
            weatherIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            weatherIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            weatherIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            weatherIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            weatherIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            weatherIcon.src = "icons/rain.svg";
        }
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}
function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() => {
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}
function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    fetchData();
}
function onSuccess(position){
    const {latitude,longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
    fetchData();
}
function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}
inputField.addEventListener("keyup",event => {
    if(event.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});
locationButton.addEventListener("click", () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});
arrowBack.addEventListener("click",() => {
    wrapper.classList.remove("active");
});