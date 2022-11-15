let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let celsiusTemp = null;
let searchForm = document.querySelector("#search-form");
let currentButton = document.querySelector("#current-button");
let celsiusUnitLink = document.querySelector("#celsius");
let fahrenheitUnitLink = document.querySelector("#fahrenheit");

function formatTime(date) {
  let time = new Date(date * 1000);
  let weekDay = days[time.getDay()];
  let timeHour = time.getHours();
  let timeMinute = time.getMinutes();
  return `${weekDay} ${timeHour}:${timeMinute}`;
}

function displayData(response) {
  let cityNameElement = document.querySelector("#city");
  let temperatureElement = document.querySelector(".current-temp");
  let descriptionElement = document.querySelector("#description");
  let updatedTimeElement = document.querySelector("#time");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind");
  let todayIconElement = document.querySelector("#today-icon");
  let iconUrl = `images/${response.data.weather[0].icon}.svg`;

  celsiusTemp = Math.round(response.data.main.temp);
  cityNameElement.innerHTML = response.data.name;
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  updatedTimeElement.innerHTML = formatTime(response.data.dt);
  todayIconElement.src = iconUrl;
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecast = "";
  let forecastDays = response.data.daily.slice(1, 7);

  function createHtml(day) {
    let date = new Date(day.dt * 1000);
    let weekDay = days[date.getDay()].slice(0, 3);

    forecast += `<div class="col-3 col-sm-2 p-1">
        <div class="card text-bg-light mb-3 forecast-container">
         <div class="card-header forecast-date">${weekDay}</div>
         <div class="card-body p-1 forecast-img">
           <img src="images/${
             day.weather[0].icon
           }.svg" class="forecast-img"></img>
         </div>
         <div class="card-footer p-1 pt-2 pb-2 forecast-temp">
           <span class="forecast-temp-max"> ${Math.round(day.temp.max)}° </span
           ><span class="forecast-temp-min text-muted"> ${Math.round(
             day.temp.min
           )}°</span>
       </div>
      </div>
    </div>`;
  }

  forecastDays.forEach(createHtml);
  forecastElement.innerHTML = forecast;
}

function getForecast(apiKey, units, coords) {
  let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=${units}`;
  axios.get(forecastUrl).then(displayForecast);
}

function getTemperature(city) {
  let apiKey = "203fa770242fcd2b9555d832a88ea567";
  let units = "metric";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(url).then(function (response) {
    displayData(response);
    getForecast(apiKey, units, response.data.coord);
  });
}

function searchData(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  if (searchInput.value.trim()) {
    let inputValue = searchInput.value.trim().toLowerCase();
    getTemperature(inputValue);
  }
}

function getCurrentTemperature(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "203fa770242fcd2b9555d832a88ea567";
  let units = "metric";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(url).then(displayData);
  getForecast(apiKey, units, { lat: latitude, lon: longitude });
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(getCurrentTemperature);
}

function changeUnit(event) {
  event.preventDefault();
  let temperature = document.querySelector(".current-temp");
  let active = event.target.classList.contains("active");
  let isCelsius = event.target.innerHTML === "°C";

  if (!active) {
    celsiusUnitLink.classList.toggle("active");
    fahrenheitUnitLink.classList.toggle("active");
    temperature.innerHTML = isCelsius
      ? celsiusTemp
      : Math.round(celsiusTemp * 1.8 + 32);
  }
}

getTemperature("Tehran");
searchForm.addEventListener("submit", searchData);
currentButton.addEventListener("click", getPosition);
celsiusUnitLink.addEventListener("click", changeUnit);
fahrenheitUnitLink.addEventListener("click", changeUnit);
