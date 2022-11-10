// let days = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday"
// ];
// let currentTime = new Date();
// let weekDay = days[currentTime.getDay()];
// let timeHour = currentTime.getHours();
// let timeMinute = currentTime.getMinutes();
// let timeHeading = document.querySelector("#time");
let searchForm = document.querySelector("#search-form");
let currentButton = document.querySelector("#current-button");
// let celsiusUnitLink = document.querySelector("#celsius");
// let fahrenheitUnitLink = document.querySelector("#fahrenheit");
// timeHeading.innerHTML = `${weekDay} ${timeHour}:${timeMinute}`;

function displayData(response) {
  let temp = Math.round(response.data.main.temp);
  let city = response.data.name;
  let description = response.data.weather[0].main;
  let cityName = document.querySelector("#city");
  let temperature = document.querySelector(".current-temp");
  let weatherDescription = document.querySelector("#description");
  cityName.innerHTML = city;
  temperature.innerHTML = temp;
  weatherDescription.innerHTML = description;
}

function getTemperature(city) {
  let apiKey = "203fa770242fcd2b9555d832a88ea567";
  let units = "metric";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(displayData);
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
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(getCurrentTemperature);
}

// function changeUnit(event) {
//   event.preventDefault();
//   let temperature = document.querySelector(".current-temp");
//   let isCelsius = event.target.innerHTML === "°C";
//   if (isCelsius) {
//     temperature.innerHTML = "19";
//   } else {
//     temperature.innerHTML = "66";
//   }
// }
getPosition();
searchForm.addEventListener("submit", searchData);
currentButton.addEventListener("click", getPosition);
// celsiusUnitLink.addEventListener("click", changeUnit);
// fahrenheitUnitLink.addEventListener("click", changeUnit);
